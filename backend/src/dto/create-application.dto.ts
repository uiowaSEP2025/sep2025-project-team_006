import { IsEnum, IsNotEmpty, IsString, } from 'class-validator';
import { ApplicationDepartmentType, ApplicationDegreeProgramType } from "../modules/applications/applications.enum";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ApplicationDepartmentType, {
    message: 'department should be one of the valid choices',
  })
  department: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ApplicationDegreeProgramType, {
    message: 'degree_program should be one of the valid choices',
  })
  degree_program: string;
}
