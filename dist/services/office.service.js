"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeService = void 0;
const office_repository_1 = require("../repositories/office.repository");
const custom_error_1 = require("../utils/custom.error");
const logger_1 = require("../utils/logger");
class OfficeService {
    officeRepository;
    logger;
    constructor() {
        this.officeRepository = new office_repository_1.OfficeRepository();
        this.logger = new logger_1.Logger("OfficeService");
    }
    async createOffice(createOfficeDto) {
        try {
            this.logger.info("Creating new office", { email: createOfficeDto.email });
            const existingOffice = await this.officeRepository.findOne({
                email: createOfficeDto.email,
            });
            if (existingOffice) {
                this.logger.warn("Office creation failed - email already exists", {
                    email: createOfficeDto.email,
                });
                throw new custom_error_1.CustomError("Office with this email already exists", 400);
            }
            const office = await this.officeRepository.create({
                ...createOfficeDto,
                totalOfficers: 0,
                officers: [],
            });
            this.logger.info("Office created successfully", { officeId: office._id });
            return office;
        }
        catch (error) {
            this.logger.error("Office creation failed", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getAllOffices(query = {}) {
        try {
            this.logger.info("Fetching all offices", { query });
            const offices = await this.officeRepository.find(query);
            this.logger.info("Offices fetched successfully", {
                count: offices.length,
            });
            return offices;
        }
        catch (error) {
            this.logger.error("Failed to fetch offices", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getOfficeById(id) {
        try {
            this.logger.info("Fetching office by ID", { officeId: id });
            const office = await this.officeRepository.findById(id);
            if (!office) {
                this.logger.warn("Office not found", { officeId: id });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            this.logger.info("Office fetched successfully", { officeId: id });
            return office;
        }
        catch (error) {
            this.logger.error("Failed to fetch office", error.stack, {
                officeId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async updateOffice(id, updateOfficeDto) {
        try {
            this.logger.info("Updating office", {
                officeId: id,
                updates: updateOfficeDto,
            });
            const office = await this.officeRepository.update(id, updateOfficeDto);
            if (!office) {
                this.logger.warn("Office not found for update", { officeId: id });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            this.logger.info("Office updated successfully", { officeId: id });
            return office;
        }
        catch (error) {
            this.logger.error("Failed to update office", error.stack, {
                officeId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async deleteOffice(id) {
        try {
            this.logger.info("Deleting office", { officeId: id });
            const result = await this.officeRepository.delete(id);
            if (!result) {
                this.logger.warn("Office not found for deletion", { officeId: id });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            this.logger.info("Office deleted successfully", { officeId: id });
        }
        catch (error) {
            this.logger.error("Failed to delete office", error.stack, {
                officeId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async addOfficerToOffice(officeId, officerId) {
        try {
            this.logger.info("Adding officer to office", { officeId, officerId });
            const office = await this.officeRepository.addOfficer(officeId, officerId);
            if (!office) {
                this.logger.warn("Office not found while adding officer", {
                    officeId,
                    officerId,
                });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            this.logger.info("Officer added to office successfully", {
                officeId,
                officerId,
            });
            return office;
        }
        catch (error) {
            this.logger.error("Failed to add officer to office", error.stack, {
                officeId,
                officerId,
                error: error.message,
            });
            throw error;
        }
    }
    async getOfficesByOfficer(officerId) {
        try {
            this.logger.info("Fetching offices by officer", { officerId });
            // const offices = await this.officeRepository.findOne({
            //   officers: { $in: [officerId] },
            // });
            const offices = await this.officeRepository.find({
                officers: { $in: [officerId] },
            });
            this.logger.info("Offices fetched successfully", {
                count: offices.length,
            });
            if (!offices) {
                this.logger.warn("Offices not found", { officerId });
                throw new custom_error_1.CustomError("Offices not found", 404);
            }
            return offices;
        }
        catch (error) {
            this.logger.error("Failed to fetch offices by officer", error.stack, {
                officerId,
                error: error.message,
            });
            throw error;
        }
    }
}
exports.OfficeService = OfficeService;
// method to get a list of oficces a officer belongs to
