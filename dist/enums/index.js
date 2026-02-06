"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionType = exports.AttendanceStatus = exports.MeetingStatus = exports.Months = exports.AuxiliaryType = exports.AttendanceType = exports.UserType = void 0;
// enums for user type
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "ADMIN";
    UserType["OFFICER"] = "OFFICER";
    UserType["GUEST"] = "GUEST";
})(UserType || (exports.UserType = UserType = {}));
// enum for attendance type
var AttendanceType;
(function (AttendanceType) {
    AttendanceType["FINGERPRINT"] = "FINGERPRINT";
    AttendanceType["UNIQUE_CODE"] = "UNIQUE_CODE";
    AttendanceType["GUEST_DETAILS"] = "GUEST_DETAILS";
})(AttendanceType || (exports.AttendanceType = AttendanceType = {}));
// enum for auxiliary type
var AuxiliaryType;
(function (AuxiliaryType) {
    AuxiliaryType["KHUDDAM"] = "KHUDDAM";
    AuxiliaryType["ANSARULLAH"] = "ANSARULLAH";
    AuxiliaryType["OTHERS"] = "OTHERS";
})(AuxiliaryType || (exports.AuxiliaryType = AuxiliaryType = {}));
// ENUM FOR MONTHS
var Months;
(function (Months) {
    Months["JANUARY"] = "JANUARY";
    Months["FEBRUARY"] = "FEBRUARY";
    Months["MARCH"] = "MARCH";
    Months["APRIL"] = "APRIL";
    Months["MAY"] = "MAY";
    Months["JUNE"] = "JUNE";
    Months["JULY"] = "JULY";
    Months["AUGUST"] = "AUGUST";
    Months["SEPTEMBER"] = "SEPTEMBER";
    Months["OCTOBER"] = "OCTOBER";
    Months["NOVEMBER"] = "NOVEMBER";
    Months["DECEMBER"] = "DECEMBER";
})(Months || (exports.Months = Months = {}));
var MeetingStatus;
(function (MeetingStatus) {
    MeetingStatus["SCHEDULED"] = "SCHEDULED";
    MeetingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MeetingStatus["COMPLETED"] = "COMPLETED";
    MeetingStatus["CANCELLED"] = "CANCELLED";
})(MeetingStatus || (exports.MeetingStatus = MeetingStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["EXCUSED"] = "EXCUSED";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
// Enum for officer position types
var PositionType;
(function (PositionType) {
    PositionType["EXECUTIVE"] = "EXECUTIVE";
    PositionType["HEAD"] = "HEAD";
    PositionType["ASSISTANT"] = "ASSISTANT";
    PositionType["SPECIAL"] = "SPECIAL";
})(PositionType || (exports.PositionType = PositionType = {}));
