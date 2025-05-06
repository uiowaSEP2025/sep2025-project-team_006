import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entity/review.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';

@Injectable()
export class ReviewMetricsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(ReviewMetric)
    private reviewMetricRepo: Repository<ReviewMetric>,
  ) {}

  async getReviewForApplicationAndFaculty(
    application_id: number,
    faculty_id: number,
  ) {
    const review = await this.reviewRepo.findOne({
      where: {
        application: { application_id },
        faculty: { faculty_id },
      },
      relations: ['review_metrics'],
    });
    if (!review) {
      return {
        review_exists: false,
        review_id: null,
        review_metrics: [],
        comments: null,
        overall_score: null,
      };
    }

    return {
      review_exists: true,
      review_id: review.review_id,
      review_metrics: review.review_metrics,
      submitted: review.submitted,
      comments: review.comments,
      overall_score: review.overall_score,
      liked: review.liked,
    };
  }
}
