"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeRepository = void 0;
const office_model_1 = require("../models/office.model");
const BaseRepository_1 = require("./base/BaseRepository");
const mongoose_1 = __importDefault(require("mongoose"));
class OfficeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(office_model_1.Office);
    }
    async findByIds(ids) {
        return this.model.find({ _id: { $in: ids }, isDeleted: false }).exec();
    }
    async addOfficer(officeId, officerId, session) {
        const officerObjectId = new mongoose_1.default.Types.ObjectId(officerId);
        return await this.model.findOneAndUpdate({ _id: officeId, isDeleted: false }, [
            {
                $set: {
                    officers: { $setUnion: ["$officers", [officerObjectId]] },
                },
            },
            {
                $set: {
                    totalOfficers: { $size: "$officers" },
                },
            },
        ], { new: true, session });
    }
    async removeOfficer(officeId, officerId, session) {
        const officerObjectId = new mongoose_1.default.Types.ObjectId(officerId);
        return await this.model.findOneAndUpdate({ _id: officeId, isDeleted: false }, [
            {
                $set: {
                    officers: { $setDifference: ["$officers", [officerObjectId]] },
                },
            },
            {
                $set: {
                    totalOfficers: { $size: "$officers" },
                },
            },
        ], { new: true, session });
    }
}
exports.OfficeRepository = OfficeRepository;
