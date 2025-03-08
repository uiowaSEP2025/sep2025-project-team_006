import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('api/students') // .*/api/students/.*
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('applicants') // .*/api/students/applicants
  async getApplicants() {
    return this.studentsService.getApplicants();
  }

  @Get(':id') // .*/api/students/:id
  async getStudentInfo(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentInfo(id);
  }
}
