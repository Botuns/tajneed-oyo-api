import { IOfficer } from "../interfaces";
import { CreateOfficerDto } from "../lib/types/DTOs/officer.dto";
export declare class OfficerService {
    private officerRepository;
    private officeRepository;
    private logger;
    constructor();
    createOfficer(createOfficerDto: CreateOfficerDto): Promise<IOfficer>;
    getAllOfficers(): Promise<IOfficer[]>;
    getOfficerById(id: string): Promise<IOfficer>;
    updateOfficer(id: string, updateData: Partial<IOfficer>): Promise<IOfficer>;
    deleteOfficer(id: string): Promise<void>;
    registerFingerprint(officerId: string, fingerprintData: string): Promise<IOfficer>;
    getOfficerByUniqueCode(uniqueCode: string): Promise<IOfficer>;
    private generateUniqueCode;
}
