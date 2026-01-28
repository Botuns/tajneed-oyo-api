import { IOffice } from "../interfaces";
import { CreateOfficeDto, UpdateOfficeDto } from "../lib/types/DTOs";
export declare class OfficeService {
    private officeRepository;
    private officerRepository;
    private logger;
    constructor();
    createOffice(createOfficeDto: CreateOfficeDto): Promise<IOffice>;
    getAllOffices(query?: any): Promise<IOffice[]>;
    getOfficeById(id: string): Promise<IOffice>;
    updateOffice(id: string, updateOfficeDto: UpdateOfficeDto): Promise<IOffice>;
    deleteOffice(id: string): Promise<void>;
    addOfficerToOffice(officeId: string, officerId: string): Promise<IOffice>;
    removeOfficerFromOffice(officeId: string, officerId: string): Promise<IOffice>;
    getOfficesByOfficer(officerId: string): Promise<IOffice[]>;
}
