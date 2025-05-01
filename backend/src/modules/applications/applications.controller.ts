import { Controller, Post, Body } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from 'src/dto/create-application.dto';

@Controller('api/applications') // .*/api/reviews/.*
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('') // .*/api/applications
  async postApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.createApplication(createApplicationDto);
  }
}
