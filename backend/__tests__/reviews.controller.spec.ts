import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from 'src/modules/reviews/reviews.controller';
import { ReviewsService } from 'src/modules/reviews/reviews.service';
import { Departments } from 'src/modules/templates/departments.enum';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { UpdateReviewDto } from 'src/dto/update-review.dto';

describe('ReviewsController', () => {
    let controller: ReviewsController;
    let service: ReviewsService;

    const createDto: CreateReviewDto = {
        faculty_id: 1,
        application_id: 8,
        department: Departments.ECE,
    };

    const template = {
        template_id: '123',
        department: 'ECE',
        name: 'Electrical and Computer Engineering Template',
    };

    const baseReview = {
        review_id: 1,
        review_metrics: [],
        comments: '',
        overall_score: null,
        submitted: false,
        template,
    };

    const scoresResult = { overallScore: 12.5, facultyScore: 9.0 };

    beforeEach(async () => {
        const mockService = {
            getReviewScores: jest.fn().mockResolvedValue(scoresResult),
            createReview: jest.fn().mockResolvedValue(baseReview),
            updateReview: jest.fn().mockResolvedValue({
                ...baseReview,
                comments: 'Updated comments',
                overall_score: 95,
                review_metrics: [
                    {
                        review_metric_id: 2,
                        name: 'Communication',
                        selected_weight: 0.5,
                        template_weight: 0.5,
                        value: 4,
                    },
                    {
                        review_metric_id: 3,
                        name: 'Expertise',
                        selected_weight: 0.3,
                        template_weight: 0.3,
                        value: 4,
                    },
                ],
            }),
            submitReview: jest.fn().mockResolvedValue({
                review_id: 1,
                submitted: true,
                review_metrics: [],
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewsController],
            providers: [
                {
                    provide: ReviewsService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get(ReviewsController);
        service = module.get(ReviewsService);
    });

    describe('getReviewScores', () => {
        it('should call service.getReviewScores and return its result', async () => {
            const result = await controller.getReviewScores(1);
            expect(service.getReviewScores).toHaveBeenCalledWith(1);
            expect(result).toEqual(scoresResult);
        });
    });

    describe('createReview', () => {
        it('should call service.createReview and return a review', async () => {
            const result = await controller.createReview(createDto);
            expect(service.createReview).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(baseReview);
        });
    });

    describe('updateReview', () => {
        it('should call service.updateReview and return the updated review', async () => {
            const updateDto: UpdateReviewDto = {
                comments: 'Updated comments',
                overall_score: 95,
                review_metrics: [
                    { review_metric_id: 2, selected_weight: 0.5, value: 4 },
                    { review_metric_id: 3, selected_weight: 0.3, value: 4 },
                ],
            };

            const result = await controller.updateReview(1, updateDto);
            expect(service.updateReview).toHaveBeenCalledWith(1, updateDto);
            expect(result.comments).toBe('Updated comments');
            expect(result.overall_score).toBe(95);
            expect(Array.isArray(result.review_metrics)).toBe(true);
            expect(result.review_metrics).toHaveLength(2);
        });
    });

    describe('submitReview', () => {
        it('should call service.submitReview and return the submitted review', async () => {
            const result = await controller.submitReview(1);
            expect(service.submitReview).toHaveBeenCalledWith(1);
            expect(result).toEqual({ review_id: 1, submitted: true, review_metrics: [] });
        });
    });
});
