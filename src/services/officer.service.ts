import { IOfficer } from "../interfaces";
import { CreateOfficerDto } from "../lib/types/DTOs/officer.dto";
import { OfficerRepository } from "../repositories";
import { OfficeRepository } from "../repositories/office.repository";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";
import crypto from "crypto";

export class OfficerService {
  private officerRepository: OfficerRepository;
  private officeRepository: OfficeRepository;
  private logger: Logger;

  constructor() {
    this.officerRepository = new OfficerRepository();
    this.officeRepository = new OfficeRepository();
    this.logger = new Logger("OfficerService");
  }

  async createOfficer(createOfficerDto: CreateOfficerDto): Promise<IOfficer> {
    try {
      this.logger.info("Creating new officer", {
        email: createOfficerDto.email,
      });

      const existingOfficer = await this.officerRepository.findOne({
        email: createOfficerDto.email,
      });
      if (existingOfficer) {
        this.logger.warn("Officer creation failed - email already exists", {
          email: createOfficerDto.email,
        });
        throw new CustomError("Officer with this email already exists", 400);
      }

      const uniqueCode = await this.generateUniqueCode();

      const officer = await this.officerRepository.create({
        ...createOfficerDto,
        uniqueCode,
      });

      this.logger.info("Officer created successfully", {
        officerId: officer._id,
      });
      return officer;
    } catch (error: any) {
      this.logger.error("Officer creation failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getAllOfficers(): Promise<IOfficer[]> {
    try {
      this.logger.info("Fetching all officers");
      const officers = await this.officerRepository.find({ isDeleted: false });
      this.logger.info("Officers fetched successfully", {
        count: officers.length,
      });
      return officers;
    } catch (error: any) {
      this.logger.error("Failed to fetch officers", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getOfficerById(id: string): Promise<IOfficer> {
    try {
      this.logger.info("Fetching officer by ID", { officerId: id });
      const officer = await this.officerRepository.findById(id);
      if (!officer) {
        this.logger.warn("Officer not found", { officerId: id });
        throw new CustomError("Officer not found", 404);
      }
      this.logger.info("Officer fetched successfully", { officerId: id });
      return officer;
    } catch (error: any) {
      this.logger.error("Failed to fetch officer", error.stack, {
        officerId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async updateOfficer(
    id: string,
    updateData: Partial<IOfficer>
  ): Promise<IOfficer> {
    try {
      this.logger.info("Updating officer", { officerId: id, updateData });
      const officer = await this.officerRepository.update(id, updateData);
      if (!officer) {
        this.logger.warn("Officer not found for update", { officerId: id });
        throw new CustomError("Officer not found", 404);
      }
      this.logger.info("Officer updated successfully", { officerId: id });
      return officer;
    } catch (error: any) {
      this.logger.error("Failed to update officer", error.stack, {
        officerId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteOfficer(id: string): Promise<void> {
    try {
      this.logger.info("Deleting officer", { officerId: id });
      const result = await this.officerRepository.delete(id);
      if (!result) {
        this.logger.warn("Officer not found for deletion", { officerId: id });
        throw new CustomError("Officer not found", 404);
      }
      this.logger.info("Officer deleted successfully", { officerId: id });
    } catch (error: any) {
      this.logger.error("Failed to delete officer", error.stack, {
        officerId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async registerFingerprint(
    officerId: string,
    fingerprintData: string
  ): Promise<IOfficer> {
    try {
      this.logger.info("Registering fingerprint", { officerId });

      const officer = await this.officerRepository.findById(officerId);
      if (!officer) {
        throw new CustomError("Officer not found", 404);
      }

      const hashedFingerprint = crypto
        .createHash("sha256")
        .update(fingerprintData)
        .digest("hex");

      const updatedOfficer = await this.officerRepository.update(officerId, {
        fingerprint: hashedFingerprint,
      });

      if (!updatedOfficer) {
        throw new CustomError("Failed to update officer fingerprint", 500);
      }

      this.logger.info("Fingerprint registered successfully", { officerId });
      return updatedOfficer;
    } catch (error: any) {
      this.logger.error("Failed to register fingerprint", error.stack, {
        officerId,
        error: error.message,
      });
      throw error;
    }
  }

  async getOfficerByUniqueCode(uniqueCode: string): Promise<IOfficer> {
    try {
      this.logger.info("Fetching officer by unique code", { uniqueCode });
      const officer = await this.officerRepository.findOne({
        uniqueCode,
        isDeleted: false,
      });
      if (!officer) {
        this.logger.warn("Officer not found with unique code", { uniqueCode });
        throw new CustomError("Officer not found with this unique code", 404);
      }
      this.logger.info("Officer fetched successfully by unique code");
      return officer;
    } catch (error: any) {
      this.logger.error("Failed to fetch officer by unique code", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  private async generateUniqueCode(): Promise<string> {
    let unique = false;
    let code = "";

    while (!unique) {
      code = `OYO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const existing = await this.officerRepository.findOne({
        uniqueCode: code,
      });
      if (!existing) {
        unique = true;
      }
    }

    return code;
  }
}
