import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewMetricDto {
  @IsString()
  @IsNotEmpty()
  metric_name: string;

  @IsString()
  description: string;

  @IsNumber()
  selected_weight: number;

  @IsNumber()
  value: number;

  @IsNumber()
  review_id: number; // the id of the review this metric belongs to
}
