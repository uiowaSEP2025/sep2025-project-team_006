import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from 'src/modules/reviews/reviews.controller';
import { ReviewsService } from 'src/modules/reviews/reviews.service';
import { Departments } from 'src/modules/templates/departments.enum';

describe('ReviewsController', () => {
    let controller: ReviewsController;
    let service: ReviewsService;

    const createReviewDto = { faculty_id: 1, application_id: 8, department: 'ECE' as Departments };
    const review = {
        review_id: 1,
        review_metrics: [],
        comments: '',
        overall_score: null,
        submitted: false,
        template: { template_id: '123', department: 'ECE', name: 'Electrical and Computer Engineering Template' }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewsController],
            providers: [
                {
                    provide: ReviewsService,
                    useValue: {
                        createReview: jest.fn().mockResolvedValue(review),
                        updateReview: jest.fn(),
                        submitReview: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ReviewsController>(ReviewsController);
        service = module.get<ReviewsService>(ReviewsService);
    });

    describe('createReview', () => {
        it('should return a review with the template and metrics attached', async () => {
            const result = await controller.createReview(createReviewDto);
            expect(result).toEqual(review);
            expect(service.createReview).toHaveBeenCalledWith(createReviewDto);
        });
    });

    describe('updateReview', () => {
        it('should update review comments, overall_score and review metrics', async () => {
            const reviewId = 1;
            const updateDto = {
                comments: "Updated comments",
                overall_score: 95,
                review_metrics: [
                    { review_metric_id: 2, selected_weight: 0.5, value: 4 },
                    { review_metric_id: 3, selected_weight: 0.3, value: 4 }
                ]
            };
            const updatedReview = {
                review_id: reviewId,
                comments: "Updated comments",
                overall_score: 95,
                review_metrics: [
                    { review_metric_id: 2, name: 'Communication', selected_weight: 0.5, template_weight: 0.5, value: 4 },
                    { review_metric_id: 3, name: 'Expertise', selected_weight: 0.3, template_weight: 0.3, value: 4 }
                ],
                submitted: false,
            };
            (service.updateReview as jest.Mock).mockResolvedValue(updatedReview);

            const result = await controller.updateReview(reviewId, updateDto);
            expect(result).toEqual(updatedReview);
            expect(service.updateReview).toHaveBeenCalledWith(reviewId, updateDto);
        });
    });

    describe('submitReview', () => {
        it('should mark review as submitted and return updated review', async () => {
            const reviewId = 1;
            const submittedReview = { review_id: reviewId, submitted: true, review_metrics: [] };
            (service.submitReview as jest.Mock).mockResolvedValue(submittedReview);

            const result = await controller.submitReview(reviewId);
            expect(result).toEqual(submittedReview);
            expect(service.submitReview).toHaveBeenCalledWith(reviewId);
        });
    });
});
