import { BaseEntity } from "./base.inteface";

export interface IGuest extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    organization: string;
    state: string;
    purpose: string;
}