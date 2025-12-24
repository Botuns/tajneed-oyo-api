"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficerRepository = void 0;
const officer_model_1 = require("../models/officer.model");
const BaseRepository_1 = require("./base/BaseRepository");
// methods to create --- find by uniquecpode, find by fingerprint, addtooffice
class OfficerRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(officer_model_1.Officer);
    }
    async findByUniqueCode(uniqueCode) {
        return this.model.findOne({ uniqueCode, isDeleted: false }).exec();
    }
    async findByFingerprint(fingerprint) {
        return this.model.findOne({ fingerprint, isDeleted: false }).exec();
    }
    async addToOffice(officerId, officeId) {
        return await this.model.findOneAndUpdate({ _id: officerId, isDeleted: false }, {
            $addToSet: { offices: officeId },
        }, { new: true });
    }
    async count(query = {}) {
        try {
            const count = await this.model.countDocuments(query).exec();
            return count;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.OfficerRepository = OfficerRepository;
