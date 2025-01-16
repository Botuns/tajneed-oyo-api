import { Request, Response } from "express";
import { CreateOfficerDto } from "../lib/types/DTOs/officer.dto";
import { OfficerService } from "../services";
import { ApiResponse } from "../utils/api.response";
import { Logger } from "../utils/logger";

export class OfficerController {
  private officerService: OfficerService;
  private logger: Logger;
  constructor() {
    this.officerService = new OfficerService();
    this.logger = new Logger("OfficerController");
  }

  createOfficer = async (req: Request, res: Response): Promise<void> => {
    try {
      const createOfficerDto: CreateOfficerDto = req.body;
      this.logger.info("Received create officer request", {
        dto: createOfficerDto,
      });
      const officer = await this.officerService.createOfficer(createOfficerDto);
      res
        .status(201)
        .json(ApiResponse.success(officer, "Officer created successfully"));
    } catch (error: any) {
      this.logger.error("Create officer request failed", error.stack, {
        error: error.message,
      });
      if (error.statusCode === 400) {
        res
          .status(400)
          .json(ApiResponse.validationError({ email: "Email already exists" }));
        return;
      }
      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  //   getAllOfficers = async (req: Request, res: Response): Promise<void> => {
  //     try {
  //       this.logger.info("Received get all officers request", {
  //         query: req.query,
  //       });
  //       const officers = await this.officerService.getAllOfficers(req.query);
  //       res
  //         .status(200)
  //         .json(ApiResponse.success(officers, "Officers retrieved successfully"));
  //     } catch (error: any) {
  //       this.logger.error("Get all officers request failed", error.stack, {
  //         error: error.message,
  //       });
  //     }
  //   };
}
