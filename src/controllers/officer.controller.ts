import { Request, Response } from "express";
import { CreateOfficerDto } from "../lib/types/DTOs/officer.dto";
import { OfficerService } from "../services";
import { ApiResponse, ResponseStatus } from "../utils/api.response";
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

  getAllOfficers = async (req: Request, res: Response): Promise<void> => {
    try {
      this.logger.info("Received get all officers request");
      const officers = await this.officerService.getAllOfficers();
      res
        .status(200)
        .json(ApiResponse.success(officers, "Officers retrieved successfully"));
    } catch (error: any) {
      this.logger.error("Get all officers request failed", error.stack, {
        error: error.message,
      });
      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getOfficerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info("Received get officer by ID request", { officerId: id });

      const officer = await this.officerService.getOfficerById(id);

      res
        .status(200)
        .json(ApiResponse.success(officer, "Officer retrieved successfully"));
    } catch (error: any) {
      this.logger.error("Get officer by ID request failed", error.stack, {
        officerId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Officer not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  updateOfficer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      this.logger.info("Received update officer request", {
        officerId: id,
        updates: req.body,
      });

      const officer = await this.officerService.updateOfficer(id, req.body);

      res
        .status(200)
        .json(ApiResponse.success(officer, "Officer updated successfully"));
    } catch (error: any) {
      this.logger.error("Update officer request failed", error.stack, {
        officerId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Officer not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  deleteOfficer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info("Received delete officer request", { officerId: id });

      await this.officerService.deleteOfficer(id);

      res
        .status(200)
        .json(ApiResponse.success(null, "Officer deleted successfully"));
    } catch (error: any) {
      this.logger.error("Delete officer request failed", error.stack, {
        officerId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Officer not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  registerFingerprint = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { fingerprintData } = req.body;

      this.logger.info("Received register fingerprint request", {
        officerId: id,
      });

      const officer = await this.officerService.registerFingerprint(
        id,
        fingerprintData
      );

      res
        .status(200)
        .json(
          ApiResponse.success(officer, "Fingerprint registered successfully")
        );
    } catch (error: any) {
      this.logger.error("Register fingerprint request failed", error.stack, {
        officerId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Officer not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getOfficerByUniqueCode = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { uniqueCode } = req.params;

      this.logger.info("Received get officer by unique code request", {
        uniqueCode,
      });

      const officer = await this.officerService.getOfficerByUniqueCode(
        uniqueCode
      );

      res
        .status(200)
        .json(ApiResponse.success(officer, "Officer retrieved successfully"));
    } catch (error: any) {
      this.logger.error(
        "Get officer by unique code request failed",
        error.stack,
        {
          uniqueCode: req.params.uniqueCode,
          error: error.message,
        }
      );

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error(
              "Officer not found with this unique code",
              [],
              ResponseStatus.ERROR
            )
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };
}
