import { IOffice } from "../interfaces";
import { Office } from "../models/office.model";
import { BaseRepository } from "./base/BaseRepository";
import mongoose from "mongoose";

export class OfficeRepository extends BaseRepository<IOffice> {
  constructor() {
    super(Office);
  }

  async findByIds(ids: string[]): Promise<IOffice[]> {
    return this.model.find({ _id: { $in: ids }, isDeleted: false }).exec();
  }

  async addOfficer(
    officeId: string,
    officerId: string,
    session?: mongoose.ClientSession,
  ): Promise<IOffice | null> {
    const officerObjectId = new mongoose.Types.ObjectId(officerId);
    return await this.model.findOneAndUpdate(
      { _id: officeId, isDeleted: false },
      [
        {
          $set: {
            officers: { $setUnion: ["$officers", [officerObjectId]] },
          },
        },
        {
          $set: {
            totalOfficers: { $size: "$officers" },
          },
        },
      ],
      { new: true, session },
    );
  }

  async removeOfficer(
    officeId: string,
    officerId: string,
    session?: mongoose.ClientSession,
  ): Promise<IOffice | null> {
    const officerObjectId = new mongoose.Types.ObjectId(officerId);
    return await this.model.findOneAndUpdate(
      { _id: officeId, isDeleted: false },
      [
        {
          $set: {
            officers: { $setDifference: ["$officers", [officerObjectId]] },
          },
        },
        {
          $set: {
            totalOfficers: { $size: "$officers" },
          },
        },
      ],
      { new: true, session },
    );
  }
}
