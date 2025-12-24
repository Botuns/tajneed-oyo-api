import mongoose from "mongoose";
import { IGuest } from "../interfaces";
export declare const Guest: mongoose.Model<IGuest, {}, {}, {}, mongoose.Document<unknown, {}, IGuest> & IGuest & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
