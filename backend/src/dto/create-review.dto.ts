import { IsNumber, IsString } from 'class-validator';
import { Departments } from 'src/modules/templates/departments.enum';

export class CreateReviewDto {
  @IsNumber()
  faculty_id: number;

  @IsNumber()
  application_id: number;

  @IsString()
  department: Departments;
}
