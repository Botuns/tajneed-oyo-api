"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const office_repository_1 = require("../repositories/office.repository");
const repositories_1 = require("../repositories");
const custom_error_1 = require("../utils/custom.error");
const logger_1 = require("../utils/logger");
class OfficeService {
    officeRepository;
    officerRepository;
    logger;
    constructor() {
        this.officeRepository = new office_repository_1.OfficeRepository();
        this.officerRepository = new repositories_1.OfficerRepository();
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
            const office = await this.officeRepository.findOne({
                _id: id,
                isDeleted: false,
            });
            if (!office) {
                this.logger.warn("Office not found", { officeId: id });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            // Officers are primarily associated via Officer.offices.
            // Populate from Officer collection so offices created before the bidirectional link existed still work.
            const officeOfficerIds = office.officers ?? [];
            const officers = await this.officerRepository.find({
                isDeleted: false,
                $or: [
                    { offices: { $in: [id] } },
                    { _id: { $in: officeOfficerIds } },
                ],
            });
            const officerSummaries = officers.map((officer) => ({
                id: officer.id ?? String(officer._id),
                name: `${officer.firstName ?? ""} ${officer.lastName ?? ""}`.trim(),
                email: officer.email,
            }));
            this.logger.info("Office fetched successfully", {
                officeId: id,
                officers: officerSummaries.length,
            });
            // Return the office with officers resolved to summary objects.
            // (This intentionally overrides the stored `officers` array of IDs.)
            return {
                ...(office.toObject ? office.toObject() : office),
                officers: officerSummaries,
                totalOfficers: officerSummaries.length,
            };
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
            // Validate both entities exist (and aren't soft-deleted)
            const [officeExists, officerExists] = await Promise.all([
                this.officeRepository.findOne({
                    _id: officeId,
                    isDeleted: false,
                }),
                this.officerRepository.findOne({
                    _id: officerId,
                    isDeleted: false,
                }),
            ]);
            if (!officeExists) {
                this.logger.warn("Office not found while adding officer", {
                    officeId,
                    officerId,
                });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            if (!officerExists) {
                this.logger.warn("Officer not found while adding to office", {
                    officeId,
                    officerId,
                });
                throw new custom_error_1.CustomError("Officer not found", 404);
            }
            // Best-effort atomic update using a transaction when supported.
            let session = null;
            try {
                session = await mongoose_1.default.startSession();
                session.startTransaction();
                const updatedOffice = await this.officeRepository.addOfficer(officeId, officerId, session);
                await this.officerRepository.addToOffice(officerId, officeId, session);
                await session.commitTransaction();
                if (!updatedOffice) {
                    throw new custom_error_1.CustomError("Office not found", 404);
                }
                this.logger.info("Officer added to office successfully", {
                    officeId,
                    officerId,
                });
                return updatedOffice;
            }
            catch (txError) {
                if (session) {
                    try {
                        await session.abortTransaction();
                    }
                    catch {
                        // ignore
                    }
                }
                // If transactions aren't supported (standalone Mongo), fall back to sequential updates.
                this.logger.warn("Transaction failed; falling back to sequential updates", {
                    officeId,
                    officerId,
                    error: txError?.message,
                });
                const updatedOffice = await this.officeRepository.addOfficer(officeId, officerId);
                if (!updatedOffice) {
                    throw new custom_error_1.CustomError("Office not found", 404);
                }
                try {
                    await this.officerRepository.addToOffice(officerId, officeId);
                }
                catch (e) {
                    // Compensate to avoid drift if officer update fails.
                    await this.officeRepository.removeOfficer(officeId, officerId);
                    throw e;
                }
                this.logger.info("Officer added to office successfully (sequential)", {
                    officeId,
                    officerId,
                });
                return updatedOffice;
            }
            finally {
                if (session) {
                    session.endSession();
                }
            }
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
    async removeOfficerFromOffice(officeId, officerId) {
        try {
            this.logger.info("Removing officer from office", { officeId, officerId });
            const [officeExists, officerExists] = await Promise.all([
                this.officeRepository.findOne({ _id: officeId, isDeleted: false }),
                this.officerRepository.findOne({ _id: officerId, isDeleted: false }),
            ]);
            if (!officeExists) {
                this.logger.warn("Office not found while removing officer", {
                    officeId,
                    officerId,
                });
                throw new custom_error_1.CustomError("Office not found", 404);
            }
            if (!officerExists) {
                this.logger.warn("Officer not found while removing from office", {
                    officeId,
                    officerId,
                });
                throw new custom_error_1.CustomError("Officer not found", 404);
            }
            let session = null;
            try {
                session = await mongoose_1.default.startSession();
                session.startTransaction();
                const updatedOffice = await this.officeRepository.removeOfficer(officeId, officerId, session);
                await this.officerRepository.removeFromOffice(officerId, officeId, session);
                await session.commitTransaction();
                if (!updatedOffice) {
                    throw new custom_error_1.CustomError("Office not found", 404);
                }
                this.logger.info("Officer removed from office successfully", {
                    officeId,
                    officerId,
                });
                return updatedOffice;
            }
            catch (txError) {
                if (session) {
                    try {
                        await session.abortTransaction();
                    }
                    catch {
                        // ignore
                    }
                }
                this.logger.warn("Transaction failed; falling back to sequential updates", {
                    officeId,
                    officerId,
                    error: txError?.message,
                });
                const updatedOffice = await this.officeRepository.removeOfficer(officeId, officerId);
                if (!updatedOffice) {
                    throw new custom_error_1.CustomError("Office not found", 404);
                }
                try {
                    await this.officerRepository.removeFromOffice(officerId, officeId);
                }
                catch (e) {
                    // Compensate to avoid drift if officer update fails.
                    await this.officeRepository.addOfficer(officeId, officerId);
                    throw e;
                }
                this.logger.info("Officer removed from office successfully (sequential)", { officeId, officerId });
                return updatedOffice;
            }
            finally {
                if (session) {
                    session.endSession();
                }
            }
        }
        catch (error) {
            this.logger.error("Failed to remove officer from office", error.stack, {
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
            // Support either linkage style (older data may only have Officer.offices).
            const officer = await this.officerRepository.findOne({
                _id: officerId,
                isDeleted: false,
            });
            const officeIdsFromOfficer = officer?.offices ?? [];
            const offices = await this.officeRepository.find({
                $or: [
                    { _id: { $in: officeIdsFromOfficer } },
                    {
                        officers: { $in: [officerId] },
                    },
                ],
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
