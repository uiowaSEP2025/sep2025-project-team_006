import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateReviewMetricDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  selected_weight?: number;

  @IsOptional()
  @IsNumber()
  value?: number;
}
