import { BaseEntity } from "./base.inteface";
export interface IOffice extends BaseEntity {
    name: string;
    email: string;
    description: string;
    officers: string[];
    totalOfficers: number;
    responsibilities: string[];
}
