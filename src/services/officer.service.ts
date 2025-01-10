import { IOfficer } from "../interfaces";
import { CreateOfficerDto } from "../lib/types/DTOs/officer.dto";
import { OfficerRepository } from "../repositories";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";

export class OfficerService {
  private officerRepository: OfficerRepository;
  private logger: Logger;
  constructor() {
    this.officerRepository = new OfficerRepository();
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
      const officer = await this.officerRepository.create({
        ...createOfficerDto,
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
}
