import { IOffice } from "../interfaces";
import { BaseRepository } from "./base/BaseRepository";
import mongoose from "mongoose";
export declare class OfficeRepository extends BaseRepository<IOffice> {
    constructor();
    findByIds(ids: string[]): Promise<IOffice[]>;
    addOfficer(officeId: string, officerId: string, session?: mongoose.ClientSession): Promise<IOffice | null>;
    removeOfficer(officeId: string, officerId: string, session?: mongoose.ClientSession): Promise<IOffice | null>;
}
