import { AuxiliaryType } from "../../../enums";

export class CheckInByUniqueCodeDto {
  meetingId!: string;
  uniqueCode!: string;
}

export class CheckInByFingerprintDto {
  meetingId!: string;
  fingerprint!: string;
}

export class MarkAbsentDto {
  meetingId!: string;
  officerId!: string;
  remarks?: string;
}

// Mulk member shares the Officer schema (Officer.isMulk === true).
// Same payload as the officer endpoints — the service rejects codes
// that belong to a non-mulk officer.
export class CheckInMulkByUniqueCodeDto {
  meetingId!: string;
  uniqueCode!: string;
}

export class CheckInMulkByFingerprintDto {
  meetingId!: string;
  fingerprint!: string;
}

// Walk-in guest: no pre-registration. Frontend sends the full
// guest profile at check-in time and we create the Guest doc inline.
export class CheckInGuestDto {
  meetingId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  auxiliary!: AuxiliaryType;
  state!: string;
  purpose!: string;
}
