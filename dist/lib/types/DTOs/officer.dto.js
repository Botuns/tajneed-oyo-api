"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFingerprintDto = exports.UpdateOfficerDto = exports.CreateOfficerDto = void 0;
class CreateOfficerDto {
    firstName;
    lastName;
    email;
    phoneNumber;
    offices;
    userType;
    isAdmin;
    tenureStart;
    tenureEnd;
}
exports.CreateOfficerDto = CreateOfficerDto;
class UpdateOfficerDto {
    firstName;
    lastName;
    email;
    phoneNumber;
    offices;
    userType;
    isAdmin;
    tenureStart;
    tenureEnd;
}
exports.UpdateOfficerDto = UpdateOfficerDto;
class RegisterFingerprintDto {
    fingerprintData;
}
exports.RegisterFingerprintDto = RegisterFingerprintDto;
