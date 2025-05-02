import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApplicationDto } from 'src/dto/create-application.dto';
import { Application } from 'src/entity/application.entity';
import { Student } from 'src/entity/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createApplication(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const { department, degree_program, student_id } = createApplicationDto;

    const app = this.applicationRepository.create({
      department,
      degree_program,
    });

    const student = await this.studentRepository.findOne({
      where: { student_id },
      relations: ['application'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    student.applications.push(app);
    return await this.applicationRepository.save(app);
  }
}
