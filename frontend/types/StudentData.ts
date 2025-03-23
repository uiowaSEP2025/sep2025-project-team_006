import { ApplicationData } from "./ApplicationData";

export interface StudentData {
    student_id: number;
    first_name: string;
    last_name: string;
    phone_number: string,
    address: string,
    applications: ApplicationData[]
}
