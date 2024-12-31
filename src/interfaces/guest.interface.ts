import { AuxiliaryType } from "../enums";
import { BaseEntity } from "./base.inteface";

export interface IGuest extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  auxiliary: AuxiliaryType;
  state: string;
  purpose: string;
}
