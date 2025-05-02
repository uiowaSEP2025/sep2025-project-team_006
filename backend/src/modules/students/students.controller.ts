import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  //UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
//import { AuthGuard } from '../auth/auth.guard';

@Controller('api/students') // .*/api/students/.*
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  //@UseGuards(AuthGuard)
  @Get('applicants') // .*/api/students/applicants
  async getApplicants() {
    return this.studentsService.getApplicants();
  }

  @Get('applications/:id')
  async getApplications(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getApplications(id);
  }

  //@UseGuards(AuthGuard)
  @Get(':id') // .*/api/students/:id
  async getStudentInfo(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentInfo(id);
  }
}
