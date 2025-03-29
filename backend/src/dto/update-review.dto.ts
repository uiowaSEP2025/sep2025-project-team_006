import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsNumber()
  overall_score?: number;
}
