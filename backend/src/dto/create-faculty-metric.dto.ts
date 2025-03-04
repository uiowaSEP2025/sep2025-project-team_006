import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFacultyMetricDto {
  @IsString()
  @IsNotEmpty()
  metric_name: string;

  @IsString()
  @IsNotEmpty() // TODO: determine if this has to have a value or if being empty would be fine.
  description: string;

  @IsNumber()
  default_weight: number;

  @IsNumber()
  faculty_id: number; // the id of the faculty this metric belongs to
}
