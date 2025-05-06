import { Controller, Post, Body, Param, ParseIntPipe, Get } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from 'src/dto/create-application.dto';

@Controller('api/applications') // .*/api/reviews/.*
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get(':id') // .*/api/applications/:id
  async getApplication(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.getApplication(id);
  }

  @Post('') // .*/api/applications
  async postApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.createApplication(createApplicationDto);
  }
}
