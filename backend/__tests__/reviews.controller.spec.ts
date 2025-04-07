import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from 'src/modules/reviews/reviews.controller';
import { ReviewsService } from 'src/modules/reviews/reviews.service';

describe('ReviewsController', () => {
    let controller: ReviewsController;
    let service: ReviewsService;

    const createReviewDto = { faculty_id: 1, application_id: 2 };
    const review = {
        review_id: 6,
        review_metrics: [],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewsController],
            providers: [
                {
                    provide: ReviewsService,
                    useValue: {
                        createReview: jest.fn().mockResolvedValue(review),
                        updateReviewComments: jest.fn(),
                        submitReview: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ReviewsController>(ReviewsController);
        service = module.get<ReviewsService>(ReviewsService);
    });

    describe('createReview', () => {
        it('should return a review', async () => {
            const result = await controller.createReview(createReviewDto);
            expect(result).toEqual(review);
            expect(service.createReview).toHaveBeenCalledWith(createReviewDto);
        });
    });

    describe('updateReviewComments', () => {
        it('should update review comments and overall_score and return the updated review', async () => {
            const reviewId = 1;
            const updateDto = { comments: "Updated comments", overall_score: 95 };
            const updatedReview = { review_id: reviewId, comments: "Updated comments", overall_score: 95, review_metrics: [] };
            (service.updateReviewComments as jest.Mock).mockResolvedValue(updatedReview);

            const result = await controller.updateReviewComments(reviewId, updateDto);
            expect(result).toEqual(updatedReview);
            expect(service.updateReviewComments).toHaveBeenCalledWith(reviewId, updateDto);
        });
    });

    describe('submitReview', () => {
        it('should mark review as submitted and return the updated review', async () => {
            const reviewId = 1;
            const submittedReview = { review_id: reviewId, submitted: true, review_metrics: [] };
            (service.submitReview as jest.Mock).mockResolvedValue(submittedReview);

            const result = await controller.submitReview(reviewId);
            expect(result).toEqual(submittedReview);
            expect(service.submitReview).toHaveBeenCalledWith(reviewId);
        });
    });
});
