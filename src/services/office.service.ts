import mongoose, { FilterQuery } from "mongoose";
import { IOffice } from "../interfaces";
import { CreateOfficeDto, UpdateOfficeDto } from "../lib/types/DTOs";
import { OfficeRepository } from "../repositories/office.repository";
import { OfficerRepository } from "../repositories";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";

export class OfficeService {
  private officeRepository: OfficeRepository;
  private officerRepository: OfficerRepository;
  private logger: Logger;

  constructor() {
    this.officeRepository = new OfficeRepository();
    this.officerRepository = new OfficerRepository();
    this.logger = new Logger("OfficeService");
  }

  async createOffice(createOfficeDto: CreateOfficeDto): Promise<IOffice> {
    try {
      this.logger.info("Creating new office", { email: createOfficeDto.email });

      const existingOffice = await this.officeRepository.findOne({
        email: createOfficeDto.email,
      });
      if (existingOffice) {
        this.logger.warn("Office creation failed - email already exists", {
          email: createOfficeDto.email,
        });
        throw new CustomError("Office with this email already exists", 400);
      }

      const office = await this.officeRepository.create({
        ...createOfficeDto,
        totalOfficers: 0,
        officers: [],
      });

      this.logger.info("Office created successfully", { officeId: office._id });
      return office;
    } catch (error: any) {
      this.logger.error("Office creation failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getAllOffices(query: any = {}): Promise<IOffice[]> {
    try {
      this.logger.info("Fetching all offices", { query });
      const offices = await this.officeRepository.find(query);
      this.logger.info("Offices fetched successfully", {
        count: offices.length,
      });
      return offices;
    } catch (error: any) {
      this.logger.error("Failed to fetch offices", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getOfficeById(id: string): Promise<IOffice> {
    try {
      this.logger.info("Fetching office by ID", { officeId: id });
      const office = await this.officeRepository.findOne({
        _id: id,
        isDeleted: false,
      } as any);
      if (!office) {
        this.logger.warn("Office not found", { officeId: id });
        throw new CustomError("Office not found", 404);
      }

      // Officers are primarily associated via Officer.offices.
      // Populate from Officer collection so offices created before the bidirectional link existed still work.
      const officeOfficerIds = (office as any).officers ?? [];
      const officers = await this.officerRepository.find({
        isDeleted: false,
        $or: [
          { offices: { $in: [id] } as any },
          { _id: { $in: officeOfficerIds } as any },
        ],
      } as any);

      const officerSummaries = officers.map((officer: any) => ({
        id: officer.id ?? String(officer._id),
        name: `${officer.firstName ?? ""} ${officer.lastName ?? ""}`.trim(),
        email: officer.email,
      }));

      this.logger.info("Office fetched successfully", {
        officeId: id,
        officers: officerSummaries.length,
      });

      // Return the office with officers resolved to summary objects.
      // (This intentionally overrides the stored `officers` array of IDs.)
      return {
        ...(office.toObject ? office.toObject() : (office as any)),
        officers: officerSummaries,
        totalOfficers: officerSummaries.length,
      } as any;
    } catch (error: any) {
      this.logger.error("Failed to fetch office", error.stack, {
        officeId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async updateOffice(
    id: string,
    updateOfficeDto: UpdateOfficeDto,
  ): Promise<IOffice> {
    try {
      this.logger.info("Updating office", {
        officeId: id,
        updates: updateOfficeDto,
      });
      const office = await this.officeRepository.update(id, updateOfficeDto);
      if (!office) {
        this.logger.warn("Office not found for update", { officeId: id });
        throw new CustomError("Office not found", 404);
      }
      this.logger.info("Office updated successfully", { officeId: id });
      return office;
    } catch (error: any) {
      this.logger.error("Failed to update office", error.stack, {
        officeId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteOffice(id: string): Promise<void> {
    try {
      this.logger.info("Deleting office", { officeId: id });
      const result = await this.officeRepository.delete(id);
      if (!result) {
        this.logger.warn("Office not found for deletion", { officeId: id });
        throw new CustomError("Office not found", 404);
      }
      this.logger.info("Office deleted successfully", { officeId: id });
    } catch (error: any) {
      this.logger.error("Failed to delete office", error.stack, {
        officeId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async addOfficerToOffice(
    officeId: string,
    officerId: string,
  ): Promise<IOffice> {
    try {
      this.logger.info("Adding officer to office", { officeId, officerId });

      // Validate both entities exist (and aren't soft-deleted)
      const [officeExists, officerExists] = await Promise.all([
        this.officeRepository.findOne({
          _id: officeId,
          isDeleted: false,
        } as any),
        this.officerRepository.findOne({
          _id: officerId,
          isDeleted: false,
        } as any),
      ]);

      if (!officeExists) {
        this.logger.warn("Office not found while adding officer", {
          officeId,
          officerId,
        });
        throw new CustomError("Office not found", 404);
      }

      if (!officerExists) {
        this.logger.warn("Officer not found while adding to office", {
          officeId,
          officerId,
        });
        throw new CustomError("Officer not found", 404);
      }

      // Best-effort atomic update using a transaction when supported.
      let session: mongoose.ClientSession | null = null;
      try {
        session = await mongoose.startSession();
        session.startTransaction();

        const updatedOffice = await this.officeRepository.addOfficer(
          officeId,
          officerId,
          session,
        );
        await this.officerRepository.addToOffice(officerId, officeId, session);

        await session.commitTransaction();

        if (!updatedOffice) {
          throw new CustomError("Office not found", 404);
        }

        this.logger.info("Officer added to office successfully", {
          officeId,
          officerId,
        });
        return updatedOffice;
      } catch (txError: any) {
        if (session) {
          try {
            await session.abortTransaction();
          } catch {
            // ignore
          }
        }

        // If transactions aren't supported (standalone Mongo), fall back to sequential updates.
        this.logger.warn(
          "Transaction failed; falling back to sequential updates",
          {
            officeId,
            officerId,
            error: txError?.message,
          },
        );

        const updatedOffice = await this.officeRepository.addOfficer(
          officeId,
          officerId,
        );
        if (!updatedOffice) {
          throw new CustomError("Office not found", 404);
        }

        try {
          await this.officerRepository.addToOffice(officerId, officeId);
        } catch (e: any) {
          // Compensate to avoid drift if officer update fails.
          await this.officeRepository.removeOfficer(officeId, officerId);
          throw e;
        }

        this.logger.info("Officer added to office successfully (sequential)", {
          officeId,
          officerId,
        });
        return updatedOffice;
      } finally {
        if (session) {
          session.endSession();
        }
      }
    } catch (error: any) {
      this.logger.error("Failed to add officer to office", error.stack, {
        officeId,
        officerId,
        error: error.message,
      });
      throw error;
    }
  }

  async removeOfficerFromOffice(
    officeId: string,
    officerId: string,
  ): Promise<IOffice> {
    try {
      this.logger.info("Removing officer from office", { officeId, officerId });

      const [officeExists, officerExists] = await Promise.all([
        this.officeRepository.findOne({
          _id: officeId,
          isDeleted: false,
        } as any),
        this.officerRepository.findOne({
          _id: officerId,
          isDeleted: false,
        } as any),
      ]);

      if (!officeExists) {
        this.logger.warn("Office not found while removing officer", {
          officeId,
          officerId,
        });
        throw new CustomError("Office not found", 404);
      }

      if (!officerExists) {
        this.logger.warn("Officer not found while removing from office", {
          officeId,
          officerId,
        });
        throw new CustomError("Officer not found", 404);
      }

      let session: mongoose.ClientSession | null = null;
      try {
        session = await mongoose.startSession();
        session.startTransaction();

        const updatedOffice = await this.officeRepository.removeOfficer(
          officeId,
          officerId,
          session,
        );
        await this.officerRepository.removeFromOffice(
          officerId,
          officeId,
          session,
        );

        await session.commitTransaction();

        if (!updatedOffice) {
          throw new CustomError("Office not found", 404);
        }

        this.logger.info("Officer removed from office successfully", {
          officeId,
          officerId,
        });
        return updatedOffice;
      } catch (txError: any) {
        if (session) {
          try {
            await session.abortTransaction();
          } catch {
            // ignore
          }
        }

        this.logger.warn(
          "Transaction failed; falling back to sequential updates",
          {
            officeId,
            officerId,
            error: txError?.message,
          },
        );

        const updatedOffice = await this.officeRepository.removeOfficer(
          officeId,
          officerId,
        );
        if (!updatedOffice) {
          throw new CustomError("Office not found", 404);
        }

        try {
          await this.officerRepository.removeFromOffice(officerId, officeId);
        } catch (e: any) {
          // Compensate to avoid drift if officer update fails.
          await this.officeRepository.addOfficer(officeId, officerId);
          throw e;
        }

        this.logger.info(
          "Officer removed from office successfully (sequential)",
          { officeId, officerId },
        );
        return updatedOffice;
      } finally {
        if (session) {
          session.endSession();
        }
      }
    } catch (error: any) {
      this.logger.error("Failed to remove officer from office", error.stack, {
        officeId,
        officerId,
        error: error.message,
      });
      throw error;
    }
  }
  async getOfficesByOfficer(officerId: string): Promise<IOffice[]> {
    try {
      this.logger.info("Fetching offices by officer", { officerId });

      // Support either linkage style (older data may only have Officer.offices).
      const officer = await this.officerRepository.findOne({
        _id: officerId,
        isDeleted: false,
      } as any);

      const officeIdsFromOfficer = (officer as any)?.offices ?? [];
      const offices = await this.officeRepository.find({
        $or: [
          { _id: { $in: officeIdsFromOfficer } as any },
          {
            officers: { $in: [officerId] } as FilterQuery<IOffice>["officers"],
          },
        ],
      } as any);

      this.logger.info("Offices fetched successfully", {
        count: offices.length,
      });
      if (!offices) {
        this.logger.warn("Offices not found", { officerId });
        throw new CustomError("Offices not found", 404);
      }
      return offices;
    } catch (error: any) {
      this.logger.error("Failed to fetch offices by officer", error.stack, {
        officerId,
        error: error.message,
      });
      throw error;
    }
  }
}
// method to get a list of oficces a officer belongs to
