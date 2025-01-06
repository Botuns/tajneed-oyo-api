export class CreateOfficerDto {
  name!: string;
  email!: string;
  phone!: string;
  offices!: [string];
  userType!: string;
  isAdmin!: boolean;
  tenureStart!: Date;
  tenureEnd!: Date;
  figerprint?: string;
  uniqueCode?: string;
  phoneNumber?: string;
}

export class UpdateOfficerDto {
  name?: string;
  email?: string;
  phone?: string;
  offices?: [string];
  userType?: string;
  isAdmin?: boolean;
  tenureStart?: Date;
  tenureEnd?: Date;
  figerprint?: string;
  uniqueCode?: string;
  phoneNumber?: string;
}