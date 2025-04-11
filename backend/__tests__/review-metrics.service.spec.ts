import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Review } from 'src/entity/review.entity';
import { ReviewMetricsService } from 'src/modules/reviews-metrics/review-metrics.service';

describe('ReviewMetricsService', () => {
    let service: ReviewMetricsService;
    let reviewRepo: Repository<Review>;
    let reviewMetricRepo: Repository<ReviewMetric>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewMetricsService,
                {
                    provide: getRepositoryToken(Review),
                    useValue: {
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(ReviewMetric),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ReviewMetricsService>(ReviewMetricsService);
        reviewRepo = module.get<Repository<Review>>(getRepositoryToken(Review));
        reviewMetricRepo = module.get<Repository<ReviewMetric>>(getRepositoryToken(ReviewMetric));
    });

    describe('getReviewForApplicationAndFaculty', () => {
        it('should return a review with its metrics', async () => {
            const mockReview = {
                review_id: 1,
                review_metrics: [],
                comments: null,
                overall_score: null,
                review_exists: true,
            } as unknown as Review;
            (reviewRepo.findOne as jest.Mock).mockResolvedValue(mockReview);

            const result = await service.getReviewForApplicationAndFaculty(2, 1);
            expect(result).toEqual(mockReview);
            expect(reviewRepo.findOne).toHaveBeenCalledWith({
                where: { application: { application_id: 2 }, faculty: { faculty_id: 1 } },
                relations: ['review_metrics'],
            });
        });

        it('should return an object indicating no review exists if review not found', async () => {
            (reviewRepo.findOne as jest.Mock).mockResolvedValue(null);
            const result = await service.getReviewForApplicationAndFaculty(2, 1);
            expect(result).toEqual({
                review_exists: false,
                review_id: null,
                review_metrics: [],
                comments: null,
                overall_score: null,
            });
        });
    });
});
