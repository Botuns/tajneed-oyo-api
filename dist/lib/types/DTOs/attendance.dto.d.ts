export declare class CheckInByUniqueCodeDto {
    meetingId: string;
    uniqueCode: string;
}
export declare class CheckInByFingerprintDto {
    meetingId: string;
    fingerprint: string;
}
export declare class MarkAbsentDto {
    meetingId: string;
    officerId: string;
    remarks?: string;
}
