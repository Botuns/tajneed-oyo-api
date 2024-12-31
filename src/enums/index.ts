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
