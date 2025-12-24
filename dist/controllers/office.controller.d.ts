import { Request, Response } from "express";
export declare class OfficeController {
    private officeService;
    private logger;
    constructor();
    createOffice: (req: Request, res: Response) => Promise<void>;
    getAllOffices: (req: Request, res: Response) => Promise<void>;
    getOfficeById: (req: Request, res: Response) => Promise<void>;
    updateOffice: (req: Request, res: Response) => Promise<void>;
    deleteOffice: (req: Request, res: Response) => Promise<void>;
    addOfficerToOffice: (req: Request, res: Response) => Promise<void>;
}
