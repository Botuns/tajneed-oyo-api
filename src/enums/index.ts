// enums for user type
export enum UserType {
  ADMIN = "ADMIN",
  OFFICER = "OFFICER",
  GUEST = "GUEST",
}

// enum for attendance type
export enum AttendanceType {
  FINGERPRINT = "FINGERPRINT",
  UNIQUE_CODE = "UNIQUE_CODE",
  GUEST_DETAILS = "GUEST_DETAILS",
}
// enum for auxiliary type
export enum AuxiliaryType {
  KHUDDAM = "KHUDDAM",
  ANSARULLAH = "ANSARULLAH",
  OTHERS = "OTHERS",
}

// ENUM FOR MONTHS
export enum Months {
  JANUARY = "JANUARY",
  FEBRUARY = "FEBRUARY",
  MARCH = "MARCH",
  APRIL = "APRIL",
  MAY = "MAY",
  JUNE = "JUNE",
  JULY = "JULY",
  AUGUST = "AUGUST",
  SEPTEMBER = "SEPTEMBER",
  OCTOBER = "OCTOBER",
  NOVEMBER = "NOVEMBER",
  DECEMBER = "DECEMBER",
}
export enum MeetingStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}

// Enum for officer position types
export enum PositionType {
  EXECUTIVE = "EXECUTIVE", // State Qaid, Naib State Qaid, Mut'amad, Muavin Qaid
  HEAD = "HEAD", // Nazim (department heads)
  ASSISTANT = "ASSISTANT", // Naib Nazim (assistants/deputies)
  SPECIAL = "SPECIAL", // Muhasib, Murabiy, etc.
}

// Canonical position string used to identify a Dila Qaid officer.
// Stored in Officer.position. Frontend MUST send this exact value
// when creating a Dila Qaid officer.
export const DILA_QAID_POSITION = "DILA_QAID";

// Roles surfaced by the per-meeting breakdown endpoint.
export enum AttendanceRole {
  OFFICER = "OFFICER",     // Officer that is neither mulk nor Dila Qaid
  DILA_QAID = "DILA_QAID", // Officer with position === DILA_QAID
  MULK = "MULK",           // Officer with isMulk === true
  GUEST = "GUEST",         // Walk-in guest
}
