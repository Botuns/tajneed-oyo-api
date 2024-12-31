import mongoose, { Schema } from "mongoose";
import { IGuest } from "../interfaces";

const GuestSchema = new Schema<IGuest>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    auxiliary: { type: String, required: true },
    state: { type: String, required: true },
    purpose: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Guest = mongoose.model<IGuest>("Guest", GuestSchema);
