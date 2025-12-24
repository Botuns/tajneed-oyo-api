"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAbsentDto = exports.CheckInByFingerprintDto = exports.CheckInByUniqueCodeDto = void 0;
class CheckInByUniqueCodeDto {
    meetingId;
    uniqueCode;
}
exports.CheckInByUniqueCodeDto = CheckInByUniqueCodeDto;
class CheckInByFingerprintDto {
    meetingId;
    fingerprint;
}
exports.CheckInByFingerprintDto = CheckInByFingerprintDto;
class MarkAbsentDto {
    meetingId;
    officerId;
    remarks;
}
exports.MarkAbsentDto = MarkAbsentDto;
