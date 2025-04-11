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
});
