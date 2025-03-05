import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { FacultyMetricsService } from './faculty-metrics.service';
import { FacultyMetricsController } from './faculty-metrics.controller';
import { ConfigModule } from '@nestjs/config';
import { Faculty } from 'src/entity/faculty.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([FacultyMetric, Faculty]),
  ],
  providers: [FacultyMetricsService],
  controllers: [FacultyMetricsController],
})
export class FacultyMetricsModule {}
