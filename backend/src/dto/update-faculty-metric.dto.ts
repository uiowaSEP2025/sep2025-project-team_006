import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFacultyMetricDto {
  @IsOptional()
  @IsString()
  metric_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  default_weight?: number;
}
