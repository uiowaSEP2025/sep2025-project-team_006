import { Test, TestingModule } from '@nestjs/testing';
import { ReviewMetricsController } from 'src/modules/reviews-metrics/review-metrics.controller';
import { ReviewMetricsService } from 'src/modules/reviews-metrics/review-metrics.service';

describe('ReviewMetricsController', () => {
    let controller: ReviewMetricsController;
    let service: ReviewMetricsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewMetricsController],
            providers: [
                {
                    provide: ReviewMetricsService,
                    useValue: {
                        getReviewForApplicationAndFaculty: jest.fn(),
                        createReviewMetric: jest.fn(),
                        updateReviewMetric: jest.fn(),
                        deleteReviewMetric: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ReviewMetricsController>(ReviewMetricsController);
        service = module.get<ReviewMetricsService>(ReviewMetricsService);
    });

    describe('getReviewMetricsForFacultyAndApplication', () => {
        it('should return the review object for the specified application and faculty', async () => {
            const mockReview = {
                review_exists: true,
                review_id: 1,
                review_metrics: [{ review_metric_id: 2 }, { review_metric_id: 3 }],
                comments: null,
                overall_score: null,
            };
            (service.getReviewForApplicationAndFaculty as jest.Mock).mockResolvedValue(mockReview);

            const result = await controller.getReviewMetricsForFacultyAndApplication(2, 1);
            expect(result).toEqual(mockReview);
            expect(service.getReviewForApplicationAndFaculty).toHaveBeenCalledWith(2, 1);
        });
    });

    describe('createReviewMetric', () => {
        const createDto = {
            review_id: 1,
            name: 'Communication',
            description: 'Effective communication skills',
            selected_weight: 0.5,
            value: 5,
        };

        it('should call the service to create a review metric', async () => {
            const createdMetric = { review_metric_id: 5, ...createDto };
            (service.createReviewMetric as jest.Mock).mockResolvedValue(createdMetric);

            const result = await controller.createReviewMetric(createDto);
            expect(result).toEqual(createdMetric);
            expect(service.createReviewMetric).toHaveBeenCalledWith(createDto);
        });
    });

    describe('updateReview', () => {
        const updateDto = {
            selected_weight: 0.75,
            value: 85,
        };

        it('should call the service to update a review metric', async () => {
            const updatedMetric = {
                review_metric_id: 1,
                name: 'Communication',
                description: 'Effective communication skills',
                ...updateDto
            };
            (service.updateReviewMetric as jest.Mock).mockResolvedValue(updatedMetric);

            const result = await controller.updateReview(1, updateDto);
            expect(result).toEqual(updatedMetric);
            expect(service.updateReviewMetric).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('deleteReview', () => {
        it('should call the service to delete a review metric', async () => {
            const deleteMessage = { message: 'Review metric ID: 1, has been deleted.' };
            (service.deleteReviewMetric as jest.Mock).mockResolvedValue(deleteMessage);

            const result = await controller.deleteReview(1);
            expect(result).toEqual(deleteMessage);
            expect(service.deleteReviewMetric).toHaveBeenCalledWith(1);
        });
    });
});
