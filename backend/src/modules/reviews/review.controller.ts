import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { Review } from 'src/entity/review.entity';
import { ReviewsService } from './review.service';

@Controller('api/faculty/reviews') // .*/api/review/metrics/.*
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    /**
       * GET /api/reviews/:id
       * Retrieves a review by its ID.
       */
    @Get(':id')
    async getReview(@Param('id', ParseIntPipe) id: number) {
        const review = await this.reviewsService.getReviewById(id);
        return { success: true, payload: review };
    }

    /**
     * GET /api/reviews/application/:applicationId
     * Retrieves all reviews for a specific application.
     */
    @Get('application/:applicationId')
    async getReviewsByApplication(@Param('applicationId', ParseIntPipe) applicationId: number) {
        const reviews = await this.reviewsService.getReviewsByApplication(applicationId);
        return { success: true, payload: reviews };
    }


    // New GET endpoint: Reviews for a specific application written by a specific faculty
    @Get('application/:applicationId/faculty/:facultyId')
    async getReviewsByApplicationAndFaculty(
        @Param('applicationId', ParseIntPipe) applicationId: number,
        @Param('facultyId', ParseIntPipe) facultyId: number,
    ) {
        const reviews = await this.reviewsService.getReviewsByApplicationAndFaculty(applicationId, facultyId);
        return { success: true, payload: reviews };
    }
    /**
     * POST /api/reviews
     * Creates a new review.
     * Expected request body JSON:
     * {
     *   "applicationId": 8,
     *   "facultyId": 2,
     *   "comments": "Great candidate",
     *   "overall_score": 4.5
     * }
     */
    @Post()
    async createReview(@Body() body: { applicationId: number; facultyId: number; comments?: string; overall_score?: number }) {
        const review = await this.reviewsService.createReview(body);
        return { success: true, payload: review };
    }



    /**
     * PUT /api/reviews/:id
     * Updates an existing review.
     */
    @Put(':id')
    async updateReview(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<Review>) {
        const updatedReview = await this.reviewsService.updateReview(id, updateData);
        return { success: true, payload: updatedReview };
    }

    /**
     * DELETE /api/reviews/:id
     * Deletes a review by its ID.
     */
    @Delete(':id')
    async deleteReview(@Param('id', ParseIntPipe) id: number) {
        const result = await this.reviewsService.deleteReview(id);
        return { success: true, payload: result };
    }
}
