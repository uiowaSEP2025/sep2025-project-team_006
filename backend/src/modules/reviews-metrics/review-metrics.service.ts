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
  ): Promise<Review> {
    const review = await this.reviewRepo.findOne({
      where: {
        application: { application_id },
        faculty: { faculty_id },
      },
      relations: ['review_metrics'],
    });
    if (!review) {
      throw new NotFoundException(
        `Review for application ${application_id} by faculty ${faculty_id} not found`,
      );
    }
    return review;
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
      name: createDto.metric_name,
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
