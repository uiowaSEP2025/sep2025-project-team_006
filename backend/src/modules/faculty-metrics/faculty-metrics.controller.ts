import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { FacultyMetricsService } from './faculty-metrics.service';
import { UpdateFacultyMetricDto } from 'src/dto/update-faculty-metric.dto';
import { CreateFacultyMetricDto } from 'src/dto/create-faculty-metric.dto';

@Controller('api/faculty/metrics') // .*/api/faculty/metrics/.*
export class FacultyMetricsController {
  constructor(private readonly facultyMetricsService: FacultyMetricsService) {}

  @Get(':id') // .*/api/faculty/metrics/:id
  async getMetrics(@Param('id', ParseIntPipe) id: number) {
    return this.facultyMetricsService.getMetricsByFaculty(id);
  }

  @Post() // .*/api/faculty/metrics
  async createMetric(@Body() createDto: CreateFacultyMetricDto) {
    return this.facultyMetricsService.createMetric(createDto);
  }

  @Put(':id') // .*/api/faculty/metrics/:id
  async updateMetric(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateFacultyMetricDto,
  ) {
    return this.facultyMetricsService.updateMetric(id, updateDto);
  }

  @Delete(':id') // .*/api/faculty/metrics/:id
  async deleteMetric(@Param('id', ParseIntPipe) id: number) {
    return this.facultyMetricsService.deleteMetric(id);
  }
}
