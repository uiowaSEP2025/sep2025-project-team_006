import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entity/review.entity';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { ConfigModule } from '@nestjs/config';
import { ReviewMetricsController } from './review-metrics.controller';
import { ReviewMetricsService } from './review-metrics.service';
import { ReviewMetric } from 'src/entity/review_metric.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([ReviewMetric, Review, Application, Faculty])
    ],
    controllers: [ReviewMetricsController],
    providers: [ReviewMetricsService],
})
export class ReviewMetricsModule { }
