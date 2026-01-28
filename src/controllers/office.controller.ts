import { Request, Response } from "express";
import {
  AddOfficerToOfficeDto,
  CreateOfficeDto,
  UpdateOfficeDto,
} from "../lib/types/DTOs";
import { Logger } from "../utils/logger";
import { ApiResponse, ResponseStatus } from "../utils/api.response";
import { OfficeService } from "../services";

export class OfficeController {
  private officeService: OfficeService;
  private logger: Logger;

  constructor() {
    this.officeService = new OfficeService();
    this.logger = new Logger("OfficeController");
  }

  createOffice = async (req: Request, res: Response): Promise<void> => {
    try {
      const createOfficeDto: CreateOfficeDto = req.body;
      this.logger.info("Received create office request", {
        dto: createOfficeDto,
      });

      const office = await this.officeService.createOffice(createOfficeDto);

      res
        .status(201)
        .json(ApiResponse.success(office, "Office created successfully"));
    } catch (error: any) {
      this.logger.error("Create office request failed", error.stack, {
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

  getAllOffices = async (req: Request, res: Response): Promise<void> => {
    try {
      this.logger.info("Received get all offices request", {
        query: req.query,
      });

      const offices = await this.officeService.getAllOffices(req.query);

      res
        .status(200)
        .json(ApiResponse.success(offices, "Offices retrieved successfully"));
    } catch (error: any) {
      this.logger.error("Get all offices request failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getOfficeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info("Received get office by ID request", { officeId: id });

      const office = await this.officeService.getOfficeById(id);

      res
        .status(200)
        .json(ApiResponse.success(office, "Office retrieved successfully"));
    } catch (error: any) {
      this.logger.error("Get office by ID request failed", error.stack, {
        officeId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Office not found", [], ResponseStatus.ERROR),
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  updateOffice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateOfficeDto: UpdateOfficeDto = req.body;

      this.logger.info("Received update office request", {
        officeId: id,
        updates: updateOfficeDto,
      });

      const office = await this.officeService.updateOffice(id, updateOfficeDto);

      res
        .status(200)
        .json(ApiResponse.success(office, "Office updated successfully"));
    } catch (error: any) {
      this.logger.error("Update office request failed", error.stack, {
        officeId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Office not found", [], ResponseStatus.ERROR),
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  deleteOffice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info("Received delete office request", { officeId: id });

      await this.officeService.deleteOffice(id);

      res
        .status(200)
        .json(ApiResponse.success(null, "Office deleted successfully"));
    } catch (error: any) {
      this.logger.error("Delete office request failed", error.stack, {
        officeId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Office not found", [], ResponseStatus.ERROR),
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  addOfficerToOffice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { officerId }: AddOfficerToOfficeDto = req.body;

      this.logger.info("Received add officer to office request", {
        officeId: id,
        officerId,
      });

      const office = await this.officeService.addOfficerToOffice(id, officerId);

      res
        .status(200)
        .json(
          ApiResponse.success(office, "Officer added to office successfully"),
        );
    } catch (error: any) {
      this.logger.error("Add officer to office request failed", error.stack, {
        officeId: req.params.id,
        officerId: req.body.officerId,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Office not found", [], ResponseStatus.ERROR),
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  removeOfficerFromOffice = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { officerId }: AddOfficerToOfficeDto = req.body;

      this.logger.info("Received remove officer from office request", {
        officeId: id,
        officerId,
      });

      const office = await this.officeService.removeOfficerFromOffice(
        id,
        officerId,
      );

      res
        .status(200)
        .json(
          ApiResponse.success(
            office,
            "Officer removed from office successfully",
          ),
        );
    } catch (error: any) {
      this.logger.error(
        "Remove officer from office request failed",
        error.stack,
        {
          officeId: req.params.id,
          officerId: req.body.officerId,
          error: error.message,
        },
      );

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(ApiResponse.error(error.message, [], ResponseStatus.ERROR));
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };
}
