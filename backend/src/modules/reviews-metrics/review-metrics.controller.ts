import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewMetricsService } from './review-metrics.service';

@Controller('api/reviews/metrics') // .*/api/reviews/metrics/.*
export class ReviewMetricsController {
  constructor(private readonly reviewMetricsService: ReviewMetricsService) {}

  @Get('app/:app_id/faculty/:faculty_id') // .*/api/reviews/metrics/app/:app_id/faculty/:faculty_id
  async getReviewMetricsForFacultyAndApplication(
    @Param('app_id', ParseIntPipe) application_id: number,
    @Param('faculty_id', ParseIntPipe) faculty_id: number,
  ) {
    // This method should return the review for this application that was created by the faculty
    // and then extract the review_metrics from that review.
    const review =
      await this.reviewMetricsService.getReviewForApplicationAndFaculty(
        application_id,
        faculty_id,
      );
    return review;
  }
}
