"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOfficerToOfficeDto = exports.UpdateOfficeDto = exports.CreateOfficeDto = void 0;
class CreateOfficeDto {
    name;
    email;
    description;
    responsibilities;
}
exports.CreateOfficeDto = CreateOfficeDto;
class UpdateOfficeDto {
    name;
    email;
    description;
    responsibilities;
}
exports.UpdateOfficeDto = UpdateOfficeDto;
class AddOfficerToOfficeDto {
    officerId;
}
exports.AddOfficerToOfficeDto = AddOfficerToOfficeDto;
