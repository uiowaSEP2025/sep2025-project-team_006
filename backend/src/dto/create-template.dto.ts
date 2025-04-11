import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Departments } from 'src/modules/templates/departments.enum';
import { CreateTemplateMetricDto } from './create-template-metric.dto';

export class CreateTemplateDto {
  @IsOptional()
  @IsEnum(Departments, {
    message: 'Department must be one of the allowed enum values',
  })
  department?: Departments;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;

  @IsOptional()
  @IsArray()
  metrics?: CreateTemplateMetricDto[];
}
