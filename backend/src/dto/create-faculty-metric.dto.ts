import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFacultyMetricDto {
  @IsString()
  @IsNotEmpty()
  metric_name: string;

  @IsString()
  description: string;

  @IsNumber()
  default_weight: number;

  @IsNumber()
  faculty_id: number; // the id of the faculty this metric belongs to
}
