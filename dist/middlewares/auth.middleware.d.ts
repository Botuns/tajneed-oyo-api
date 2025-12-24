import { Request, Response, NextFunction } from "express";
import { IOfficer } from "../interfaces";
interface RequestWithUser extends Request {
    user?: IOfficer;
}
export declare const isAuthenticated: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdmin: (req: RequestWithUser, res: Response, next: NextFunction) => void;
export declare const validateRequest: (Dto: any) => (req: Request, res: Response, next: NextFunction) => void;
export {};
