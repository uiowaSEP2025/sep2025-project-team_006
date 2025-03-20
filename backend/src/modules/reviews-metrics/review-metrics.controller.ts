import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { ReviewMetricsService } from './review-metrics.service';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { CreateReviewMetricDto } from 'src/dto/create-review-metric.dto';
import { UpdateReviewMetricDto } from 'src/dto/update-review-metric.dto';

@Controller('api/reviews/metrics') // .*/api/reviews/metrics/.*
export class ReviewMetricsController {
    constructor(private readonly reviewMetricsService: ReviewMetricsService) { }

    // @Get('app/:app_id/faculty/:faculty_id') // .*/api/reviews/metrics/app/:app_id/faculty/:faculty_id
    // async getReviewsByApplicationAndFaculty(
    //     @Param('app_id', ParseIntPipe) applicationId: number,
    //     @Param('faculty_id', ParseIntPipe) facultyId: number,
    // ) {
    //     const review = await this.reviewMetricsService.getReviewForApplicationAndFaculty(applicationId, facultyId);
    //     return review
    // }

    @Post() // .*/api/reviews/metrics
    async createReviewMetric(
        @Body() createDto: CreateReviewMetricDto,
    ) {
        return this.reviewMetricsService.createReviewMetric(createDto);
    }

    @Put(':id') // .*/api/reviews/metrics/:id
    async updateReview(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateDto: UpdateReviewMetricDto,
    ) {
        return this.reviewMetricsService.updateReviewMetric(id, updateDto);
    }

    @Delete(':id') // .*/api/reviews/metrics/:id
    async deleteReview(@Param('id', ParseIntPipe) id: number) {
        return this.reviewMetricsService.deleteReviewMetric(id);
    }
}
