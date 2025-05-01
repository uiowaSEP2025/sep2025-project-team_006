import { IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  department: string;

  @IsString()
  degree_program: string;
}
