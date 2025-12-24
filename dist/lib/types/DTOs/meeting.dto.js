"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMonthlyMeetingDto = exports.AddExpectedAttendeesDto = exports.UpdateMeetingStatusDto = exports.UpdateMeetingDto = exports.CreateMeetingDto = void 0;
class CreateMeetingDto {
    title;
    description;
    date;
    startTime;
    endTime;
    location;
    organizer;
    expectedAttendees;
}
exports.CreateMeetingDto = CreateMeetingDto;
class UpdateMeetingDto {
    title;
    description;
    date;
    startTime;
    endTime;
    location;
    organizer;
    expectedAttendees;
    status;
}
exports.UpdateMeetingDto = UpdateMeetingDto;
class UpdateMeetingStatusDto {
    status;
}
exports.UpdateMeetingStatusDto = UpdateMeetingStatusDto;
class AddExpectedAttendeesDto {
    officerIds;
}
exports.AddExpectedAttendeesDto = AddExpectedAttendeesDto;
class CreateMonthlyMeetingDto {
    organizerId;
}
exports.CreateMonthlyMeetingDto = CreateMonthlyMeetingDto;
