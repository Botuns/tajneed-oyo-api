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

  // get all oficers paginated

  async getAllOfficers(
    page: number = 1,
    limit: number = 10,
    query: Record<string, any> = {}
  ): Promise<{
    officers: IOfficer[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      this.logger.info("Fetching all officers", { page, limit, query });

      const skip = (page - 1) * limit;

      const total = await this.officerRepository.count(query);

      const totalPages = Math.ceil(total / limit);

      if (page > totalPages && total > 0) {
        throw new CustomError(
          `Page ${page} does not exist. Total pages: ${totalPages}`,
          400
        );
      }

      //   const officers = await this.officerRepository.find(query, {
      //     skip,
      //     limit,
      //     sort: { createdAt: -1 },
      //   });
      const officers = await this.officerRepository.find(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });

      this.logger.info("Officers fetched successfully", {
        totalOfficers: total,
        returnedOfficers: officers.length,
        page,
        totalPages,
      });

      return {
        officers,
        total,
        page,
        totalPages,
      };
    } catch (error: any) {
      this.logger.error("Failed to fetch officers", error.stack, {
        error: error.message,
        page,
        limit,
      });
      throw error;
    }
  }
}
