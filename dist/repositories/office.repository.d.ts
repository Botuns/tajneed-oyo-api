import { IOffice } from "../interfaces";
import { BaseRepository } from "./base/BaseRepository";
export declare class OfficeRepository extends BaseRepository<IOffice> {
    constructor();
    findByIds(ids: string[]): Promise<IOffice[]>;
    addOfficer(officeId: string, officerId: string): Promise<IOffice | null>;
    removeOfficer(officeId: string, officerId: string): Promise<IOffice | null>;
}
