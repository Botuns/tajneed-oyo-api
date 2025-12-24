import mongoose from "mongoose";
import { IOffice } from "../interfaces";
export declare const Office: mongoose.Model<IOffice, {}, {}, {}, mongoose.Document<unknown, {}, IOffice> & IOffice & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
