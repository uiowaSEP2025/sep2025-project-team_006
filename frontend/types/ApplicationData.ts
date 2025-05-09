import { DocumentData } from "./DocumentData";
import { StudentData } from "./StudentData";
import { ReviewData } from "./ReviewData";

export interface ApplicationData {
  application_id: number;
  status: string;
  submission_date: Date;
  department: string;
  degree_program: string;
  student: StudentData | undefined;
  documents: DocumentData[] | undefined;
  reviews: ReviewData[] | undefined;
}
