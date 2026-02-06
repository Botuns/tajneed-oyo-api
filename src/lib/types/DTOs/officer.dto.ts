import { PositionType, UserType } from "../../../enums";

export class CreateOfficerDto {
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  position!: string;
  positionType!: PositionType;
  dila!: string;
  offices?: string[];
  userType?: UserType;
  isAdmin?: boolean;
  tenureStart!: Date;
  tenureEnd?: Date;
}

export class UpdateOfficerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  positionType?: PositionType;
  dila?: string;
  offices?: string[];
  userType?: UserType;
  isAdmin?: boolean;
  tenureStart?: Date;
  tenureEnd?: Date;
}

export class RegisterFingerprintDto {
  fingerprintData!: string;
}
