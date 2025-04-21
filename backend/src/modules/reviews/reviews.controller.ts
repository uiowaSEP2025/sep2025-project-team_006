import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { UpdateReviewDto } from 'src/dto/update-review.dto';

@Controller('api/reviews') // .*/api/reviews/.*
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post() // .*/api/reviews
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Put(':id') // .*/api/reviews/:id
  async updateReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(reviewId, updateReviewDto);
  }

  @Put(':id/submit') // .*/api/reviews/:id/submit
  async submitReview(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.submitReview(reviewId);
  }

  @Get('submitted')
  async getReviewedApplicants() {
    return this.reviewService.getSubmittedReviews();
  }
}
