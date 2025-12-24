"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async create(item) {
        return this.model.create(item);
    }
    async update(id, update) {
        return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
    async find(conditions) {
        return this.model.find(conditions).exec();
    }
    async findAll() {
        return this.model.find().exec();
    }
    async findOne(conditions) {
        return this.model.findOne(conditions).exec();
    }
}
exports.BaseRepository = BaseRepository;
