import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { application } from 'express';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { UpdateReviewDto } from 'src/dto/update-review.dto';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Review } from 'src/entity/review.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Template } from 'src/entity/template.entity';
import { calculateFacultyScore } from 'src/util/calculate_faculty_score';
import { calculateOverallScore } from 'src/util/calculate_overall_score';
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
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async getReviewScores(reviewId: number) {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
      relations: ['review_metrics'],
    });
    if (!review) {
      throw new NotFoundException(`Review not found for id ${reviewId}`);
    }

    const overall_score = calculateOverallScore(review);
    const faculty_score = calculateFacultyScore(review);

    return {
      overall_score: overall_score,
      faculty_score: faculty_score,
    };
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { faculty_id, application_id, department } = createReviewDto;

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

    let template = await this.templateRepository.findOne({
      where: { department },
      relations: ['metrics'],
    });
    // Fallback to default template if no template was found for the department.
    if (!template) {
      template = await this.templateRepository.findOne({
        where: { is_default: true },
        relations: ['metrics'],
      });
    }
    if (!template) {
      throw new NotFoundException(`No template found for review creation`);
    }

    const review = this.reviewRepository.create({
      faculty,
      application,
      review_metrics: [],
      template,
    });

    if (template.metrics && template.metrics.length > 0) {
      review.review_metrics = template.metrics.map(
        (tm) =>
          ({
            name: tm.metric_name,
            selected_weight: parseFloat(tm.metric_weight),
            template_weight: parseFloat(tm.metric_weight),
            value: 0, // initialize value
          }) as ReviewMetric,
      );
    }

    return this.reviewRepository.save(review);
  }

  async updateReview(
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
      relations: ['review_metrics', 'application'],
    });
    if (!review) {
      throw new NotFoundException(`Review not found for id ${reviewId}`);
    }
    review.application.status = "In Progress";
    // Update review properties if present in the DTO
    if (typeof updateReviewDto.comments !== 'undefined') {
      review.comments = updateReviewDto.comments;
    }
    if (typeof updateReviewDto.overall_score !== 'undefined') {
      review.overall_score = updateReviewDto.overall_score;
    }

    if (
      updateReviewDto.review_metrics &&
      updateReviewDto.review_metrics.length > 0
    ) {
      review.review_metrics = review.review_metrics.map((metric) => {
        const updatedMetric = updateReviewDto.review_metrics!.find(
          (m) => m.review_metric_id === metric.review_metric_id,
        );
        if (updatedMetric) {
          return {
            ...metric,
            selected_weight: updatedMetric.selected_weight,
            value: updatedMetric.value,
          };
        }
        return metric;
      });
    }
    this.applicationRepository.save(review.application);
    return this.reviewRepository.save(review);
  }

  async getReview(reviewId: number): Promise<Review | null> {
    return await this.reviewRepository.findOne({
      where: { review_id: reviewId },
      relations: ['application', 'application.student'],
    });
  }

  async getSubmittedReviews(facultyId?: number): Promise<Review[]> {
    if (facultyId) {
      const faculty = await this.facultyRepository.findOneBy({
        faculty_id: facultyId,
      });
      if (!faculty) {
        throw new NotFoundException(`Faculty not found for id ${facultyId}`);
      }

      return await this.reviewRepository.find({
        where: {
          submitted: true,
          faculty,
        },
        relations: ['application', 'application.student'],
      });
    } else {
      return await this.reviewRepository.find({
        where: { submitted: true },
        relations: ['application', 'application.student'],
      });
    }
  }

  async submitReview(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
      relations: ['review_metrics', 'application'],
    });
    if (!review) {
      throw new NotFoundException(`Review not found for id ${reviewId}`);
    }
    review.submitted = true;
    review.application.status = "Reviewed";
    review.overall_score = calculateOverallScore(review);
    this.applicationRepository.save(review.application);
    return this.reviewRepository.save(review);
  }
}
