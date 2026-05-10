import { IGuest } from "../interfaces";
import { Guest } from "../models/guest.model";
import { BaseRepository } from "./base/BaseRepository";

export class GuestRepository extends BaseRepository<IGuest> {
  constructor() {
    super(Guest);
  }

  async findByPhone(phoneNumber: string): Promise<IGuest | null> {
    return this.model.findOne({ phoneNumber, isDeleted: false }).exec();
  }
}
