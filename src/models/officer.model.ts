import mongoose, { Schema } from "mongoose";
import { PositionType, UserType } from "../enums";
import { IOfficer } from "../interfaces/officer.interface";
const OfficerSchema = new Schema<IOfficer>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    fingerprint: { type: String },
    uniqueCode: { type: String, unique: true, sparse: true },
    position: { type: String, required: true }, // e.g., "State Qaid", "Nazim Tabligh"
    positionType: {
      type: String,
      enum: PositionType,
      required: true,
    }, // EXECUTIVE, HEAD, ASSISTANT, SPECIAL
    dila: { type: String, required: true }, // Local jamaat/chapter
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
