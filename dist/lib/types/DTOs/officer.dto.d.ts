import { UserType } from "../../../enums";
export declare class CreateOfficerDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    offices?: string[];
    userType?: UserType;
    isAdmin?: boolean;
    tenureStart: Date;
    tenureEnd?: Date;
}
export declare class UpdateOfficerDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    offices?: string[];
    userType?: UserType;
    isAdmin?: boolean;
    tenureStart?: Date;
    tenureEnd?: Date;
}
export declare class RegisterFingerprintDto {
    fingerprintData: string;
}
