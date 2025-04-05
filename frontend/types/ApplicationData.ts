import { DocumentData } from "./DocumentData";

export interface ApplicationData {
  application_id: number;
  status: string;
  submission_date: Date;
  department: string;
  degree_program: string;
  documents: DocumentData[];
}
