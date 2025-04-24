import { ApplicationData } from "./ApplicationData";

export interface StudentData {
  student_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  school: string;
  applications: ApplicationData[];
  original_gpa: number;
  original_scale: string;
  standardized_gpa: number;
}
