"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerService = void 0;
const repositories_1 = require("../repositories");
const office_repository_1 = require("../repositories/office.repository");
const custom_error_1 = require("../utils/custom.error");
const logger_1 = require("../utils/logger");
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
class OfficerService {
    officerRepository;
    officeRepository;
    logger;
    constructor() {
        this.officerRepository = new repositories_1.OfficerRepository();
        this.officeRepository = new office_repository_1.OfficeRepository();
        this.logger = new logger_1.Logger("OfficerService");
    }
    async createOfficer(createOfficerDto) {
        try {
            this.logger.info("Creating new officer", {
                email: createOfficerDto.email,
            });
            if (createOfficerDto.offices && createOfficerDto.offices.length > 0) {
                const existingOffices = await this.officeRepository.findByIds(createOfficerDto.offices);
                const existingOfficeIds = existingOffices.map((office) => office._id.toString());
                const invalidOfficeIds = createOfficerDto.offices.filter((id) => !existingOfficeIds.includes(id));
                if (invalidOfficeIds.length > 0) {
                    this.logger.warn("Officer creation failed - invalid office IDs", {
                        invalidOfficeIds,
                    });
                    throw new custom_error_1.CustomError(`Invalid office IDs: ${invalidOfficeIds.join(", ")}`, 400);
                }
            }
            const existingOfficer = await this.officerRepository.findOne({
                email: createOfficerDto.email,
            });
            if (existingOfficer) {
                this.logger.warn("Officer creation failed - email already exists", {
                    email: createOfficerDto.email,
                });
                throw new custom_error_1.CustomError("Officer with this email already exists", 400);
            }
            const uniqueCode = await this.generateUniqueCode();
            const officeIds = createOfficerDto.offices ?? [];
            // Best-effort atomic create + bidirectional linkage.
            let session = null;
            try {
                session = await mongoose_1.default.startSession();
                session.startTransaction();
                const officer = await this.officerRepository.create({
                    ...createOfficerDto,
                    uniqueCode,
                });
                for (const officeId of officeIds) {
                    await this.officeRepository.addOfficer(officeId, String(officer._id), session);
                }
                await session.commitTransaction();
                this.logger.info("Officer created successfully", {
                    officerId: officer._id,
                });
                return officer;
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
                    error: txError?.message,
                });
                const officer = await this.officerRepository.create({
                    ...createOfficerDto,
                    uniqueCode,
                });
                const updatedOfficeIds = [];
                try {
                    for (const officeId of officeIds) {
                        await this.officeRepository.addOfficer(officeId, String(officer._id));
                        updatedOfficeIds.push(officeId);
                    }
                }
                catch (linkError) {
                    // Roll back to avoid leaving drift in either direction.
                    for (const officeId of updatedOfficeIds) {
                        try {
                            await this.officeRepository.removeOfficer(officeId, String(officer._id));
                        }
                        catch {
                            // ignore
                        }
                    }
                    try {
                        await this.officerRepository.delete(String(officer._id));
                    }
                    catch {
                        // ignore
                    }
                    throw linkError;
                }
                this.logger.info("Officer created successfully (sequential)", {
                    officerId: officer._id,
                });
                return officer;
            }
            finally {
                if (session) {
                    session.endSession();
                }
            }
        }
        catch (error) {
            this.logger.error("Officer creation failed", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getAllOfficers() {
        try {
            this.logger.info("Fetching all officers");
            const officers = await this.officerRepository.find({ isDeleted: false });
            this.logger.info("Officers fetched successfully", {
                count: officers.length,
            });
            return officers;
        }
        catch (error) {
            this.logger.error("Failed to fetch officers", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getOfficerById(id) {
        try {
            this.logger.info("Fetching officer by ID", { officerId: id });
            const officer = await this.officerRepository.findById(id);
            if (!officer) {
                this.logger.warn("Officer not found", { officerId: id });
                throw new custom_error_1.CustomError("Officer not found", 404);
            }
            this.logger.info("Officer fetched successfully", { officerId: id });
            return officer;
        }
        catch (error) {
            this.logger.error("Failed to fetch officer", error.stack, {
                officerId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async updateOfficer(id, updateData) {
        try {
            this.logger.info("Updating officer", { officerId: id, updateData });
            const officer = await this.officerRepository.update(id, updateData);
            if (!officer) {
                this.logger.warn("Officer not found for update", { officerId: id });
                throw new custom_error_1.CustomError("Officer not found", 404);
            }
            this.logger.info("Officer updated successfully", { officerId: id });
            return officer;
        }
        catch (error) {
            this.logger.error("Failed to update officer", error.stack, {
                officerId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async deleteOfficer(id) {
        try {
            this.logger.info("Deleting officer", { officerId: id });
            const result = await this.officerRepository.delete(id);
            if (!result) {
                this.logger.warn("Officer not found for deletion", { officerId: id });
                throw new custom_error_1.CustomError("Officer not found", 404);
            }
            this.logger.info("Officer deleted successfully", { officerId: id });
        }
        catch (error) {
            this.logger.error("Failed to delete officer", error.stack, {
                officerId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async registerFingerprint(officerId, fingerprintData) {
        try {
            this.logger.info("Registering fingerprint", { officerId });
            const officer = await this.officerRepository.findById(officerId);
            if (!officer) {
                throw new custom_error_1.CustomError("Officer not found", 404);
            }
            const hashedFingerprint = crypto_1.default
                .createHash("sha256")
                .update(fingerprintData)
                .digest("hex");
            const updatedOfficer = await this.officerRepository.update(officerId, {
                fingerprint: hashedFingerprint,
            });
            if (!updatedOfficer) {
                throw new custom_error_1.CustomError("Failed to update officer fingerprint", 500);
            }
            this.logger.info("Fingerprint registered successfully", { officerId });
            return updatedOfficer;
        }
        catch (error) {
            this.logger.error("Failed to register fingerprint", error.stack, {
                officerId,
                error: error.message,
            });
            throw error;
        }
    }
    async getOfficerByUniqueCode(uniqueCode) {
        try {
            this.logger.info("Fetching officer by unique code", { uniqueCode });
            const officer = await this.officerRepository.findOne({
                uniqueCode,
                isDeleted: false,
            });
            if (!officer) {
                this.logger.warn("Officer not found with unique code", { uniqueCode });
                throw new custom_error_1.CustomError("Officer not found with this unique code", 404);
            }
            this.logger.info("Officer fetched successfully by unique code");
            return officer;
        }
        catch (error) {
            this.logger.error("Failed to fetch officer by unique code", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async generateUniqueCode() {
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
exports.OfficerService = OfficerService;
