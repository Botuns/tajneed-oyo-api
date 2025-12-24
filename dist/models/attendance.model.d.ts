import mongoose from "mongoose";
import { IAttendance } from "../interfaces";
export declare const Attendance: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance> & IAttendance & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
