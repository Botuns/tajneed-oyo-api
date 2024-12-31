import mongoose, { Schema } from "mongoose";
import { IOffice } from "../interfaces";

const OfficeSchema = new Schema<IOffice>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    officers: [{ type: Schema.Types.ObjectId, ref: "Officer" }],
    totalOfficers: { type: Number, default: 0 },
    responsibilities: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Office = mongoose.model<IOffice>("Office", OfficeSchema);
