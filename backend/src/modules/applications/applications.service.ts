import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApplicationDto } from 'src/dto/create-application.dto';
import { Application } from 'src/entity/application.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async createApplication(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const { department, degree_program } = createApplicationDto;

    const app = this.applicationRepository.create({
      department,
      degree_program,
    });
    return this.applicationRepository.save(app);
  }
}
