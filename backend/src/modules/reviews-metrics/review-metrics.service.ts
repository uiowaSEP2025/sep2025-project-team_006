import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entity/review.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { UpdateReviewMetricDto } from 'src/dto/update-review-metric.dto';
import { CreateReviewMetricDto } from 'src/dto/create-review-metric.dto';

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
      comments: review.comments,
      overall_score: review.overall_score,
    };
  }

  async createReviewMetric(
    createDto: CreateReviewMetricDto,
  ): Promise<ReviewMetric> {
    const review = await this.reviewRepo.findOneBy({
      review_id: createDto.review_id,
    });
    if (!review) {
      throw new NotFoundException(
        `Review with id ${createDto.review_id} not found`,
      );
    }

    const newMetric = this.reviewMetricRepo.create({
      name: createDto.name,
      description: createDto.description,
      selected_weight: createDto.selected_weight,
      value: createDto.value,
      review: review,
    });
    return await this.reviewMetricRepo.save(newMetric);
  }

  async updateReviewMetric(
    id: number,
    updateDto: UpdateReviewMetricDto,
  ): Promise<ReviewMetric> {
    const metric = await this.reviewMetricRepo.findOne({
      where: { review_metric_id: id },
    });
    if (!metric) {
      throw new NotFoundException(`ReviewMetric with id ${id} not found`);
    }
    Object.assign(metric, updateDto);
    return await this.reviewMetricRepo.save(metric);
  }

  async deleteReviewMetric(id: number): Promise<{ message: string }> {
    const metric = await this.reviewMetricRepo.findOne({
      where: { review_metric_id: id },
    });
    if (!metric) {
      throw new NotFoundException(`ReviewMetric with id ${id} not found`);
    }
    await this.reviewMetricRepo.remove(metric);
    return { message: `Review metric ID: ${id}, has been deleted.` };
  }
}
