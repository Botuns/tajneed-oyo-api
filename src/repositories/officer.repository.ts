import { IOfficer } from "../interfaces";
import { Officer } from "../models/officer.model";
import { BaseRepository } from "./base/BaseRepository";

// methods to create --- find by uniquecpode, find by fingerprint, addtooffice
export class OfficerRepository extends BaseRepository<IOfficer> {
  constructor() {
    super(Officer);
  }

  async findByUniqueCode(uniqueCode: string): Promise<IOfficer | null> {
    return this.model.findOne({ uniqueCode, isDeleted: false }).exec();
  }

  async findByFingerprint(fingerprint: string): Promise<IOfficer | null> {
    return this.model.findOne({ fingerprint, isDeleted: false }).exec();
  }
  async addToOffice(
    officerId: string,
    officeId: string
  ): Promise<IOfficer | null> {
    return await this.model.findOneAndUpdate(
      { _id: officerId, isDeleted: false },
      {
        $addToSet: { offices: officeId },
      },
      { new: true }
    );
  }
  async count(query: Record<string, any> = {}): Promise<number> {
    try {
      const count = await this.model.countDocuments(query).exec();

      return count;
    } catch (error: any) {
      throw error;
    }
  }
  async find(
    query: Partial<IOfficer>,
    options?: {
      skip?: number;
      limit?: number;
      sort?: { [key: string]: number };
    }
  ): Promise<IOfficer[]> {
    return this.model
      .find(query)
      .skip(options?.skip || 0)
      .limit(options?.limit || 10)
      .sort(options?.sort || {})
      .exec();
  }
}
