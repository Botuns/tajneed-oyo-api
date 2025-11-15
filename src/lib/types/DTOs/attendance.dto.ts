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
