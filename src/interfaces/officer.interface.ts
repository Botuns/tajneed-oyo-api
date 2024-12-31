import { UserType } from "../enums";
import { BaseEntity } from "./base.inteface";

export interface IOfficer extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fingerprint?: string;
  uniqueCode: string;
  offices: string[]; // References to Office IDs
  userType: UserType;
  isAdmin: boolean;
  tenureStart: Date;
  tenureEnd?: Date;
}
