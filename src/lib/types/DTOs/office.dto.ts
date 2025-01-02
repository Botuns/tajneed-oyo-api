export class CreateOfficeDto {
  name!: string;
  email!: string;
  description!: string;
  responsibilities!: string[];
}

export class UpdateOfficeDto {
  name?: string;
  email?: string;
  description?: string;
  responsibilities?: string[];
}

export class AddOfficerToOfficeDto {
  officerId!: string;
}
