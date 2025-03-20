import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entity/review.entity';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { UpdateReviewMetricDto } from 'src/dto/update-review-metric.dto';
import { CreateReviewMetricDto } from 'src/dto/create-review-metric.dto';

@Injectable()
export class ReviewMetricsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    @InjectRepository(Faculty)
    private facultyRepo: Repository<Faculty>,
    @InjectRepository(ReviewMetric)
    private reviewMetricRepo: Repository<ReviewMetric>,
  ) { }

  // async getReviewForApplicationAndFaculty(
  //   applicationId: number,
  //   facultyId: number,
  // ): Promise<Review> {
  //   const review = await this.reviewRepo.findOne({
  //     where: {
  //       application: { application_id: applicationId },
  //       faculty: { faculty_id: facultyId },
  //     },
  //     relations: ['review_metrics'],
  //   });
  //   if (!review) {
  //     throw new NotFoundException(`Review for application ${applicationId} by faculty ${facultyId} not found`);
  //   }
  //   return review;
  // }

  async createReviewMetric(
    createDto: CreateReviewMetricDto,
  ): Promise<ReviewMetric> {
    // Optionally, you might want to verify that the review exists before linking
    const review = await this.reviewRepo.findOneBy({ review_id: createDto.review_id });
    if (!review) {
      throw new NotFoundException(`Review with id ${createDto.review_id} not found`);
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
    updateDto: UpdateReviewMetricDto
  ): Promise<ReviewMetric> {
    const metric = await this.reviewMetricRepo.findOne({
      where: { review_metric_id: id }
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
