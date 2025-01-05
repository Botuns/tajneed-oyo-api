import { FilterQuery } from "mongoose";
import { IOffice } from "../interfaces";
import { CreateOfficeDto, UpdateOfficeDto } from "../lib/types/DTOs";
import { OfficeRepository } from "../repositories/office.repository";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";

export class OfficeService {
  private officeRepository: OfficeRepository;
  private logger: Logger;

  constructor() {
    this.officeRepository = new OfficeRepository();
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
      const office = await this.officeRepository.findById(id);
      if (!office) {
        this.logger.warn("Office not found", { officeId: id });
        throw new CustomError("Office not found", 404);
      }
      this.logger.info("Office fetched successfully", { officeId: id });
      return office;
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
    updateOfficeDto: UpdateOfficeDto
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
    officerId: string
  ): Promise<IOffice> {
    try {
      this.logger.info("Adding officer to office", { officeId, officerId });
      const office = await this.officeRepository.addOfficer(
        officeId,
        officerId
      );
      if (!office) {
        this.logger.warn("Office not found while adding officer", {
          officeId,
          officerId,
        });
        throw new CustomError("Office not found", 404);
      }
      this.logger.info("Officer added to office successfully", {
        officeId,
        officerId,
      });
      return office;
    } catch (error: any) {
      this.logger.error("Failed to add officer to office", error.stack, {
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
      // const offices = await this.officeRepository.findOne({
      //   officers: { $in: [officerId] },
      // });
      const offices = await this.officeRepository.find({
        officers: { $in: [officerId] } as FilterQuery<IOffice>["officers"],
      });

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
