import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Put,
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

  // POST .*/api/faculty/metrics
  @Post() // curl --header "Content-Type: application/json" --request POST --data "{ \"metric_name\": \"NEW GPA\", \"description\": \"Iowa GPA\", \"default_weight\": 2.0, \"faculty_id\": 1 }" http://localhost:5000/api/faculty/metrics
  async createMetric(@Body() createDto: CreateFacultyMetricDto) {
    return this.facultyMetricsService.createMetric(createDto);
  }

  // PUT .*/api/faculty/metrics/:id
  @Put(':id') // curl --header "Content-Type: application/json" --request PUT --data "{ \"metric_name\": \"Updated GPA\", \"default_weight\": 5.5 }" http://localhost:5000/api/faculty/metrics/1
  async updateMetric(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateFacultyMetricDto,
  ) {
    return this.facultyMetricsService.updateMetric(id, updateDto);
  }
}
