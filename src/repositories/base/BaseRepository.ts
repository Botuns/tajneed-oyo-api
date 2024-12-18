import mongoose from "mongoose";
export abstract class BaseRepository<T extends mongoose.Document> {
  protected model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async find(conditions: Partial<T>): Promise<T[]> {
    return this.model.find(conditions as mongoose.FilterQuery<T>).exec();
  }

  async findOne(conditions: Partial<T>): Promise<T | null> {
    return this.model.findOne(conditions as mongoose.FilterQuery<T>).exec();
  }
}
