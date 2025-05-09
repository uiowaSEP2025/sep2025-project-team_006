import { ApplicationData } from "./ApplicationData";

export interface ReviewData {
  review_id: number;
  overall_score: string;
  review_date: Date;
  comments: string;
  submitted: boolean;
  liked: boolean;
  application: ApplicationData | undefined;
  reviews: ReviewData[] | undefined;
}
