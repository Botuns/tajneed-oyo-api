"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeRepository = void 0;
const office_model_1 = require("../models/office.model");
const BaseRepository_1 = require("./base/BaseRepository");
class OfficeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(office_model_1.Office);
    }
    async findByIds(ids) {
        return this.model.find({ _id: { $in: ids }, isDeleted: false }).exec();
    }
    async addOfficer(officeId, officerId) {
        return await this.model.findOneAndUpdate({ _id: officeId, isDeleted: false }, {
            $addToSet: { officers: officerId },
            $inc: { totalOfficers: 1 },
        }, { new: true });
    }
    async removeOfficer(officeId, officerId) {
        return await this.model.findOneAndUpdate({ _id: officeId, isDeleted: false }, {
            $pull: { officers: officerId },
            $inc: { totalOfficers: -1 },
        }, { new: true });
    }
}
exports.OfficeRepository = OfficeRepository;
