import { Request, Response } from "express";
export declare class OfficerController {
    private officerService;
    private logger;
    constructor();
    createOfficer: (req: Request, res: Response) => Promise<void>;
    getAllOfficers: (req: Request, res: Response) => Promise<void>;
    getOfficerById: (req: Request, res: Response) => Promise<void>;
    updateOfficer: (req: Request, res: Response) => Promise<void>;
    deleteOfficer: (req: Request, res: Response) => Promise<void>;
    registerFingerprint: (req: Request, res: Response) => Promise<void>;
    getOfficerByUniqueCode: (req: Request, res: Response) => Promise<void>;
}
