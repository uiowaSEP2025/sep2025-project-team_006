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

// curl -X GET "http://localhost:5000/api/reviews/metrics/app/8/faculty/1/metrics"
// curl -X POST "http://localhost:5000/api/reviews/metrics" -H "Content-Type: application/json" -d "{ \"review_id\": 1, \"metric_name\": \"Communication\", \"description\": \"Effective communication skills\", \"selected_weight\": 0.5, \"value\": 5 }"
// curl -X PUT "http://localhost:5000/api/reviews/metrics/1" -H "Content-Type: application/json" -d "{ \"selected_weight\": 0.75, \"value\": 85 }"
// curl -X DELETE "http://localhost:5000/api/reviews/metrics/1"