import mongoose from "mongoose";
export declare abstract class BaseRepository<T extends mongoose.Document> {
    protected model: mongoose.Model<T>;
    constructor(model: mongoose.Model<T>);
    findById(id: string): Promise<T | null>;
    create(item: Partial<T>): Promise<T>;
    update(id: string, update: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    find(conditions: Partial<T>): Promise<T[]>;
    findAll(): Promise<T[]>;
    findOne(conditions: Partial<T>): Promise<T | null>;
}
