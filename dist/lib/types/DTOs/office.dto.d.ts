export declare class CreateOfficeDto {
    name: string;
    email: string;
    description: string;
    responsibilities: string[];
}
export declare class UpdateOfficeDto {
    name?: string;
    email?: string;
    description?: string;
    responsibilities?: string[];
}
export declare class AddOfficerToOfficeDto {
    officerId: string;
}
