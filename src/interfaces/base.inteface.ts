import mongoose from "mongoose";

export interface BaseEntity extends mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
