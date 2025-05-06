import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateApplicationDto } from 'src/dto/create-application.dto';
import {
  ApplicationDepartmentType,
  ApplicationDegreeProgramType,
} from 'src/modules/applications/applications.enum';

describe('CreateApplicationDto', () => {
  it('validates a correctly populated DTO', async () => {
    const dto = plainToInstance(CreateApplicationDto, {
      student_id: 42,
      department: ApplicationDepartmentType.CEE,
      degree_program: ApplicationDegreeProgramType.MS,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects missing or non‐numeric student_id', async () => {
    const dto = plainToInstance(CreateApplicationDto, {
      student_id: 'not a number',
      department: ApplicationDepartmentType.CEE,
      degree_program: ApplicationDegreeProgramType.MS,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'student_id')).toBe(true);
  });

  it('rejects an invalid department', async () => {
    const dto = plainToInstance(CreateApplicationDto, {
      student_id: 1,
      department: 'INVALID_DEPT',
      degree_program: ApplicationDegreeProgramType.MS,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'department')).toBe(true);
    const deptError = errors.find(e => e.property === 'department');
    expect(deptError?.constraints).toHaveProperty('isEnum');
  });

  it('rejects an empty degree_program', async () => {
    const dto = plainToInstance(CreateApplicationDto, {
      student_id: 1,
      department: ApplicationDepartmentType.BME,
      degree_program: '',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'degree_program')).toBe(true);
    const progError = errors.find(e => e.property === 'degree_program');
    expect(progError?.constraints).toHaveProperty('isNotEmpty');
  });
});
