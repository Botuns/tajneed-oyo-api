"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerController = void 0;
const services_1 = require("../services");
const api_response_1 = require("../utils/api.response");
const logger_1 = require("../utils/logger");
class OfficerController {
    officerService;
    logger;
    constructor() {
        this.officerService = new services_1.OfficerService();
        this.logger = new logger_1.Logger("OfficerController");
    }
    createOfficer = async (req, res) => {
        try {
            const createOfficerDto = req.body;
            this.logger.info("Received create officer request", {
                dto: createOfficerDto,
            });
            const officer = await this.officerService.createOfficer(createOfficerDto);
            res
                .status(201)
                .json(api_response_1.ApiResponse.success(officer, "Officer created successfully"));
        }
        catch (error) {
            this.logger.error("Create officer request failed", error.stack, {
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
    getAllOfficers = async (req, res) => {
        try {
            this.logger.info("Received get all officers request");
            const officers = await this.officerService.getAllOfficers();
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(officers, "Officers retrieved successfully"));
        }
        catch (error) {
            this.logger.error("Get all officers request failed", error.stack, {
                error: error.message,
            });
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    getOfficerById = async (req, res) => {
        try {
            const { id } = req.params;
            this.logger.info("Received get officer by ID request", { officerId: id });
            const officer = await this.officerService.getOfficerById(id);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(officer, "Officer retrieved successfully"));
        }
        catch (error) {
            this.logger.error("Get officer by ID request failed", error.stack, {
                officerId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Officer not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    updateOfficer = async (req, res) => {
        try {
            const { id } = req.params;
            this.logger.info("Received update officer request", {
                officerId: id,
                updates: req.body,
            });
            const officer = await this.officerService.updateOfficer(id, req.body);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(officer, "Officer updated successfully"));
        }
        catch (error) {
            this.logger.error("Update officer request failed", error.stack, {
                officerId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Officer not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    deleteOfficer = async (req, res) => {
        try {
            const { id } = req.params;
            this.logger.info("Received delete officer request", { officerId: id });
            await this.officerService.deleteOfficer(id);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(null, "Officer deleted successfully"));
        }
        catch (error) {
            this.logger.error("Delete officer request failed", error.stack, {
                officerId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Officer not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    registerFingerprint = async (req, res) => {
        try {
            const { id } = req.params;
            const { fingerprintData } = req.body;
            this.logger.info("Received register fingerprint request", {
                officerId: id,
            });
            const officer = await this.officerService.registerFingerprint(id, fingerprintData);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(officer, "Fingerprint registered successfully"));
        }
        catch (error) {
            this.logger.error("Register fingerprint request failed", error.stack, {
                officerId: req.params.id,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Officer not found", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
    getOfficerByUniqueCode = async (req, res) => {
        try {
            const { uniqueCode } = req.params;
            this.logger.info("Received get officer by unique code request", {
                uniqueCode,
            });
            const officer = await this.officerService.getOfficerByUniqueCode(uniqueCode);
            res
                .status(200)
                .json(api_response_1.ApiResponse.success(officer, "Officer retrieved successfully"));
        }
        catch (error) {
            this.logger.error("Get officer by unique code request failed", error.stack, {
                uniqueCode: req.params.uniqueCode,
                error: error.message,
            });
            if (error.statusCode === 404) {
                res
                    .status(404)
                    .json(api_response_1.ApiResponse.error("Officer not found with this unique code", [], api_response_1.ResponseStatus.ERROR));
                return;
            }
            res
                .status(error.statusCode || 500)
                .json(api_response_1.ApiResponse.error(error.message));
        }
    };
}
exports.OfficerController = OfficerController;
