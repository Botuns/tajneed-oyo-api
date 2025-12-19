import { IOffice } from "../interfaces";
import { Office } from "../models/office.model";
import { BaseRepository } from "./base/BaseRepository";

export class OfficeRepository extends BaseRepository<IOffice> {
  constructor() {
    super(Office);
  }

  async findByIds(ids: string[]): Promise<IOffice[]> {
    return this.model.find({ _id: { $in: ids }, isDeleted: false }).exec();
  }

  async addOfficer(
    officeId: string,
    officerId: string
  ): Promise<IOffice | null> {
    return await this.model.findOneAndUpdate(
      { _id: officeId, isDeleted: false },
      {
        $addToSet: { officers: officerId },
        $inc: { totalOfficers: 1 },
      },
      { new: true }
    );
  }

  async removeOfficer(
    officeId: string,
    officerId: string
  ): Promise<IOffice | null> {
    return await this.model.findOneAndUpdate(
      { _id: officeId, isDeleted: false },
      {
        $pull: { officers: officerId },
        $inc: { totalOfficers: -1 },
      },
      { new: true }
    );
  }
}
