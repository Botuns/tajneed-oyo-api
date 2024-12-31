import mongoose, { Schema } from "mongoose";
import { UserType } from "../enums";
import { IOfficer } from "../interfaces/officer.interface";
const OfficerSchema = new Schema<IOfficer>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    fingerprint: { type: String },
    uniqueCode: { type: String, required: true, unique: true },
    offices: [{ type: Schema.Types.ObjectId, ref: "Office" }],
    userType: { type: String, enum: UserType, default: UserType.OFFICER },
    isAdmin: { type: Boolean, default: false },
    tenureStart: { type: Date, required: true },
    tenureEnd: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Officer = mongoose.model<IOfficer>("Officer", OfficerSchema);
