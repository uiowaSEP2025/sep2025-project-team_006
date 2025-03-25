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
});
