"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeController = void 0;
const logger_1 = require("../utils/logger");
const api_response_1 = require("../utils/api.response");
const services_1 = require("../services");
class OfficeController {
    officeService;
    logger;
    constructor() {
        this.officeService = new services_1.OfficeService();
        this.logger = new logger_1.Logger("OfficeController");
    }
    createOffice = async (req, res) => {
        try {
            const createOfficeDto = req.body;
            this.logger.info("Received create office request", {
                dto: createOfficeDto,
            });
            const office = await this.officeService.createOffice(createOfficeDto);
            res
                .status(201)
                .json(api_response_1.ApiResponse.success(office, "Office created successfully"));
        }
        catch (error) {
            this.logger.error("Create office request failed", error.stack, {
                error: error.message,
            });
            if (error.statusCode === 400) {
                res
                    .status(400)
                    .json(api_response_1.ApiResponse.validationError({ email: "Email already exists" }));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    getAllOffices = async (req, res) => {
        try {
            this.logger.info("Received get all offices request", {
                query: req.query,
            });
            const offices = await this.officeService.getAllOffices(req.query);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(offices, "Offices retrieved successfully"));
        }
        catch (error) {
            this.logger.error("Get all offices request failed", error.stack, {
                error: error.message,
            });
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    getOfficeById = async (req, res) => {
        try {
            const { id } = req.params;
            this.logger.info("Received get office by ID request", { officeId: id });
            const office = await this.officeService.getOfficeById(id);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(office, "Office retrieved successfully"));
        }
        catch (error) {
            this.logger.error("Get office by ID request failed", error.stack, {
                officeId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Office not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    updateOffice = async (req, res) => {
        try {
            const { id } = req.params;
            const updateOfficeDto = req.body;
            this.logger.info("Received update office request", {
                officeId: id,
                updates: updateOfficeDto,
            });
            const office = await this.officeService.updateOffice(id, updateOfficeDto);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(office, "Office updated successfully"));
        }
        catch (error) {
            this.logger.error("Update office request failed", error.stack, {
                officeId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Office not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    deleteOffice = async (req, res) => {
        try {
            const { id } = req.params;
            this.logger.info("Received delete office request", { officeId: id });
            await this.officeService.deleteOffice(id);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(null, "Office deleted successfully"));
        }
        catch (error) {
            this.logger.error("Delete office request failed", error.stack, {
                officeId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Office not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    addOfficerToOffice = async (req, res) => {
        try {
            const { id } = req.params;
            const { officerId } = req.body;
            this.logger.info("Received add officer to office request", {
                officeId: id,
                officerId,
            });
            const office = await this.officeService.addOfficerToOffice(id, officerId);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(office, "Officer added to office successfully"));
        }
        catch (error) {
            this.logger.error("Add officer to office request failed", error.stack, {
                officeId: req.params.id,
                officerId: req.body.officerId,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Office not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
}
exports.OfficeController = OfficeController;
