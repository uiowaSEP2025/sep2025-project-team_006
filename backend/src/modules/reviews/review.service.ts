import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entity/review.entity';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    @InjectRepository(Faculty)
    private facultyRepo: Repository<Faculty>,
  ) {}

  async createReview(data: {
    applicationId: number;
    facultyId: number;
    comments?: string;
    overall_score?: number;
  }): Promise<Review> {
    const application = await this.applicationRepo.findOneBy({ application_id: data.applicationId });
    if (!application) {
      throw new NotFoundException(`Application with id ${data.applicationId} not found`);
    }
    const faculty = await this.facultyRepo.findOneBy({ faculty_id: data.facultyId });
    if (!faculty) {
      throw new NotFoundException(`Faculty with id ${data.facultyId} not found`);
    }
    const review = this.reviewRepo.create({
      application,
      faculty,
      comments: data.comments,
      overall_score: data.overall_score,
    });
    return await this.reviewRepo.save(review);
  }

  async getReviewById(reviewId: number): Promise<Review> {
    const review = await this.reviewRepo.findOne({
      where: { review_id: reviewId },
      relations: ['application', 'faculty', 'review_metrics'],
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }
    return review;
  }

  async getReviewsByApplication(applicationId: number): Promise<Review[]> {
    const reviews = await this.reviewRepo.find({
      where: { application: { application_id: applicationId } },
      relations: ['faculty', 'review_metrics'],
    });
    return reviews;
  }

  /**
   * Retrieves reviews for a given application that were written by the specified faculty.
   * @param applicationId The application ID.
   * @param facultyId The faculty ID (of the reviewer).
   * @returns An array of reviews.
   */
  async getReviewsByApplicationAndFaculty(
    applicationId: number,
    facultyId: number,
  ): Promise<Review[]> {
    // Optionally, you might want to validate that the application and faculty exist.
    const reviews = await this.reviewRepo.find({
      where: {
        application: { application_id: applicationId },
        faculty: { faculty_id: facultyId },
      },
      relations: ['review_metrics'], // Include additional relations if needed
    });
    return reviews;
  }

  async updateReview(reviewId: number, updateData: Partial<Review>): Promise<Review> {
    const review = await this.getReviewById(reviewId);
    Object.assign(review, updateData);
    return await this.reviewRepo.save(review);
  }

  async deleteReview(reviewId: number): Promise<{ success: boolean }> {
    const review = await this.getReviewById(reviewId);
    await this.reviewRepo.remove(review);
    return { success: true };
  }
}
