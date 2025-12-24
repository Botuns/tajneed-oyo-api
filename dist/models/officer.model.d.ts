import mongoose from "mongoose";
import { IOfficer } from "../interfaces/officer.interface";
export declare const Officer: mongoose.Model<IOfficer, {}, {}, {}, mongoose.Document<unknown, {}, IOfficer> & IOfficer & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
