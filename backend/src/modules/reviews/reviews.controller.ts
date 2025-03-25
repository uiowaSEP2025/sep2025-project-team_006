import { Controller, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from 'src/dto/create-review.dto';

@Controller('api/reviews') // .*/api/reviews/.*
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post() // .*/api/reviews
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }
}
