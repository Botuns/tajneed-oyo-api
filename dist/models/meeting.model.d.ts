import mongoose from "mongoose";
import { IMeeting } from "../interfaces";
export declare const Meeting: mongoose.Model<IMeeting, {}, {}, {}, mongoose.Document<unknown, {}, IMeeting> & IMeeting & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
