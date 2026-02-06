import { PositionType, UserType } from "../enums";
import { BaseEntity } from "./base.inteface";

export interface IOfficer extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fingerprint?: string;
  uniqueCode: string;
  position: string; // e.g., "State Qaid", "Nazim Tabligh", "Naib Nazim Tabligh"
  positionType: PositionType; // EXECUTIVE, HEAD, ASSISTANT, SPECIAL
  dila: string; // Local jamaat/chapter (e.g., "Ibadan", "Monatan")
  offices: string[]; // References to Office IDs
  userType: UserType;
  isAdmin: boolean;
  tenureStart: Date;
  tenureEnd?: Date;
}
