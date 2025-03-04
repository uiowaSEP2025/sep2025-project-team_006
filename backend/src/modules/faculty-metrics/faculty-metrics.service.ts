import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { UpdateFacultyMetricDto } from 'src/dto/update-faculty-metric.dto';
import { Faculty } from 'src/entity/faculty.entity';
import { CreateFacultyMetricDto } from 'src/dto/create-faculty-metric.dto';

@Injectable()
export class FacultyMetricsService {
  constructor(
    @InjectRepository(FacultyMetric)
    private facultyMetricRepo: Repository<FacultyMetric>,
    @InjectRepository(Faculty)
    private facultyRepo: Repository<Faculty>,
  ) {}

  async getMetricsByFaculty(facultyId: number): Promise<FacultyMetric[]> {
    return await this.facultyMetricRepo.find({
      where: { faculty: { faculty_id: facultyId } },
      order: { faculty_metric_id: 'ASC' },
    });
  }

  async createMetric(
    createDto: CreateFacultyMetricDto,
  ): Promise<FacultyMetric> {
    // Ensure the faculty exists first
    const faculty = await this.facultyRepo.findOneBy({
      faculty_id: createDto.faculty_id,
    });
    if (!faculty) {
      throw new NotFoundException(
        `Faculty with id ${createDto.faculty_id} not found`,
      );
    }
    const newMetric = this.facultyMetricRepo.create({
      metric_name: createDto.metric_name,
      description: createDto.description,
      default_weight: createDto.default_weight,
      faculty,
    });
    return await this.facultyMetricRepo.save(newMetric);
  }

  async updateMetric(
    metricId: number,
    updateDto: UpdateFacultyMetricDto,
  ): Promise<FacultyMetric> {
    const metric = await this.facultyMetricRepo.findOne({
      where: { faculty_metric_id: metricId },
    });
    if (!metric) {
      throw new NotFoundException(`Metric with id ${metricId} not found`);
    }
    Object.assign(metric, updateDto);
    return await this.facultyMetricRepo.save(metric);
  }
}
