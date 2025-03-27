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
                        findOneBy: jest.fn(), // in case needed
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
            const mockReview = { review_id: 1, review_metrics: [] } as unknown as Review;
            (reviewRepo.findOne as jest.Mock).mockResolvedValue(mockReview);

            const result = await service.getReviewForApplicationAndFaculty(2, 1);
            expect(result).toEqual(mockReview);
            expect(reviewRepo.findOne).toHaveBeenCalledWith({
                where: { application: { application_id: 2 }, faculty: { faculty_id: 1 } },
                relations: ['review_metrics'],
            });
        });

        it('should throw NotFoundException if review not found', async () => {
            (reviewRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.getReviewForApplicationAndFaculty(2, 1))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('createReviewMetric', () => {
        const createDto = {
            review_id: 1,
            metric_name: 'Communication',
            description: 'Effective communication skills',
            selected_weight: 0.5,
            value: 5,
        };

        it('should create and save a new review metric', async () => {
            const mockReview = { review_id: 1 } as Review;
            (reviewRepo.findOneBy as jest.Mock) = jest.fn().mockResolvedValue(mockReview);
            (reviewMetricRepo.create as jest.Mock).mockReturnValue({
                name: createDto.metric_name,
                description: createDto.description,
                selected_weight: createDto.selected_weight,
                value: createDto.value,
                review: mockReview,
            });
            const savedMetric = {
                review_metric_id: 5,
                name: createDto.metric_name,
                description: createDto.description,
                selected_weight: createDto.selected_weight,
                value: createDto.value,
                review: mockReview,
            };
            (reviewMetricRepo.save as jest.Mock).mockResolvedValue(savedMetric);

            const result = await service.createReviewMetric(createDto);
            expect(result).toEqual(savedMetric);
            expect(reviewRepo.findOneBy).toHaveBeenCalledWith({ review_id: createDto.review_id });
            expect(reviewMetricRepo.create).toHaveBeenCalledWith({
                name: createDto.metric_name,
                description: createDto.description,
                selected_weight: createDto.selected_weight,
                value: createDto.value,
                review: mockReview,
            });
            expect(reviewMetricRepo.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if review is not found', async () => {
            (reviewRepo.findOneBy as jest.Mock) = jest.fn().mockResolvedValue(null);
            await expect(service.createReviewMetric(createDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateReviewMetric', () => {
        const updateDto = {
            selected_weight: 0.75,
            value: 85,
        };

        it('should update and save the review metric', async () => {
            const mockMetric = {
                review_metric_id: 1,
                name: 'Communication',
                description: 'Effective communication skills',
                selected_weight: 0.5,
                value: 5,
            } as ReviewMetric;
            (reviewMetricRepo.findOne as jest.Mock).mockResolvedValue(mockMetric);

            const updatedMetric = {
                ...mockMetric,
                ...updateDto,
            };
            (reviewMetricRepo.save as jest.Mock).mockResolvedValue(updatedMetric);

            const result = await service.updateReviewMetric(1, updateDto);
            expect(result).toEqual(updatedMetric);
            expect(reviewMetricRepo.findOne).toHaveBeenCalledWith({ where: { review_metric_id: 1 } });
            expect(reviewMetricRepo.save).toHaveBeenCalledWith(updatedMetric);
        });

        it('should throw NotFoundException if review metric not found', async () => {
            (reviewMetricRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.updateReviewMetric(1, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteReviewMetric', () => {
        it('should remove the review metric and return a success message', async () => {
            const mockMetric = { review_metric_id: 1 } as ReviewMetric;
            (reviewMetricRepo.findOne as jest.Mock).mockResolvedValue(mockMetric);
            (reviewMetricRepo.remove as jest.Mock).mockResolvedValue(mockMetric);

            const result = await service.deleteReviewMetric(1);
            expect(result).toEqual({ message: `Review metric ID: 1, has been deleted.` });
            expect(reviewMetricRepo.findOne).toHaveBeenCalledWith({ where: { review_metric_id: 1 } });
            expect(reviewMetricRepo.remove).toHaveBeenCalledWith(mockMetric);
        });

        it('should throw NotFoundException if review metric not found', async () => {
            (reviewMetricRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.deleteReviewMetric(1)).rejects.toThrow(NotFoundException);
        });
    });
});
