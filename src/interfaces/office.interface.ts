import { BaseEntity } from "./base.inteface";

export interface IOffice extends BaseEntity {
    name: string;
    email: string;
    description: string;
    officers: string[]; // References to Officer IDs
    totalOfficers: number;
    responsibilities: string[];
}