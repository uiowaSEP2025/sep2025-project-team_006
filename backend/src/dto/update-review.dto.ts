import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewMetricDto {
  @IsNumber()
  review_metric_id: number;

  @IsNumber()
  selected_weight: number;

  @IsNumber()
  value: number;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsNumber()
  overall_score?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReviewMetricDto)
  review_metrics?: UpdateReviewMetricDto[];
}
