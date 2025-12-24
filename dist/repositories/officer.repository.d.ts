import { IOfficer } from "../interfaces";
import { BaseRepository } from "./base/BaseRepository";
export declare class OfficerRepository extends BaseRepository<IOfficer> {
    constructor();
    findByUniqueCode(uniqueCode: string): Promise<IOfficer | null>;
    findByFingerprint(fingerprint: string): Promise<IOfficer | null>;
    addToOffice(officerId: string, officeId: string): Promise<IOfficer | null>;
    count(query?: Record<string, any>): Promise<number>;
}
