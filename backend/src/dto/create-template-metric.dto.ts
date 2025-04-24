import { IsString, IsOptional } from 'class-validator';

export class CreateTemplateMetricDto {
  @IsString()
  metric_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  metric_weight: string;
}
