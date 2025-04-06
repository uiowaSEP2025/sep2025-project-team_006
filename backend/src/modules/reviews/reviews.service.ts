import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { UpdateReviewDto } from 'src/dto/update-review.dto';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Review } from 'src/entity/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { faculty_id, application_id } = createReviewDto;

    const faculty = await this.facultyRepository.findOneBy({ faculty_id });
    if (!faculty) {
      throw new NotFoundException(`Faculty not found for id ${faculty_id}`);
    }

    const application = await this.applicationRepository.findOneBy({
      application_id,
    });
    if (!application) {
      throw new NotFoundException(
        `Application not found for id ${application_id}`,
      );
    }

    const review = this.reviewRepository.create({
      faculty,
      application,
      review_metrics: [],
    });

    return this.reviewRepository.save(review);
  }

  async updateReviewComments(
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId,
    });
    if (!review) {
      throw new NotFoundException(`Review not found for id ${reviewId}`);
    }

    // Update the review fields that are present in the DTO
    if (typeof updateReviewDto.comments !== 'undefined') {
      review.comments = updateReviewDto.comments;
    }

    // If you also want to update the overall_score
    if (typeof updateReviewDto.overall_score !== 'undefined') {
      review.overall_score = updateReviewDto.overall_score;
    }

    return this.reviewRepository.save(review);
  }

  async submitReview(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId,
    });
    if (!review) {
      throw new NotFoundException(`Review not found for id ${reviewId}`);
    }
    review.submitted = true;
    return this.reviewRepository.save(review);
  }
}
