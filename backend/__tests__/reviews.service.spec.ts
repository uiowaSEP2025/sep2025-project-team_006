import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from 'src/modules/reviews/reviews.service';
import { Review } from 'src/entity/review.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Application } from 'src/entity/application.entity';

describe('ReviewsService', () => {
    let service: ReviewsService;
    let reviewRepository: Repository<Review>;
    let facultyRepository: Repository<Faculty>;
    let applicationRepository: Repository<Application>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewsService,
                {
                    provide: getRepositoryToken(Review),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Faculty),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Application),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ReviewsService>(ReviewsService);
        reviewRepository = module.get<Repository<Review>>(getRepositoryToken(Review));
        facultyRepository = module.get<Repository<Faculty>>(getRepositoryToken(Faculty));
        applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
    });

    describe('createReview', () => {
        const createReviewDto = { faculty_id: 1, application_id: 2 };

        it('should create a review successfully', async () => {
            const faculty = { faculty_id: 1 } as Faculty;
            const application = { application_id: 2 } as Application;
            const createdReview = { faculty, application, review_metrics: [] } as unknown as Review;
            const savedReview = { ...createdReview, review_id: 6 };

            jest.spyOn(facultyRepository, 'findOneBy').mockResolvedValue(faculty);
            jest.spyOn(applicationRepository, 'findOneBy').mockResolvedValue(application);
            jest.spyOn(reviewRepository, 'create').mockReturnValue(createdReview);
            jest.spyOn(reviewRepository, 'save').mockResolvedValue(savedReview);

            const result = await service.createReview(createReviewDto);
            expect(result).toEqual(savedReview);
            expect(facultyRepository.findOneBy).toHaveBeenCalledWith({ faculty_id: createReviewDto.faculty_id });
            expect(applicationRepository.findOneBy).toHaveBeenCalledWith({ application_id: createReviewDto.application_id });
            expect(reviewRepository.create).toHaveBeenCalledWith({
                faculty,
                application,
                review_metrics: [],
            });
            expect(reviewRepository.save).toHaveBeenCalledWith(createdReview);
        });

        it('should throw NotFoundException if faculty is not found', async () => {
            jest.spyOn(facultyRepository, 'findOneBy').mockResolvedValue(null);

            await expect(service.createReview(createReviewDto)).rejects.toThrow(NotFoundException);
            expect(facultyRepository.findOneBy).toHaveBeenCalledWith({ faculty_id: createReviewDto.faculty_id });
        });

        it('should throw NotFoundException if application is not found', async () => {
            const faculty = { faculty_id: 1 } as Faculty;
            jest.spyOn(facultyRepository, 'findOneBy').mockResolvedValue(faculty);
            jest.spyOn(applicationRepository, 'findOneBy').mockResolvedValue(null);

            await expect(service.createReview(createReviewDto)).rejects.toThrow(NotFoundException);
            expect(applicationRepository.findOneBy).toHaveBeenCalledWith({ application_id: createReviewDto.application_id });
        });
    });

    describe('updateReviewComments', () => {
        it('should update both comments and overall_score when provided', async () => {
            const reviewId = 1;
            const updateDto = { comments: "New comments", overall_score: 90 };
            const existingReview = { review_id: reviewId, comments: "Old comments", overall_score: null } as unknown as Review;
            jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValue(existingReview);
            const updatedReview = { ...existingReview, ...updateDto };
            jest.spyOn(reviewRepository, 'save').mockResolvedValue(updatedReview);

            const result = await service.updateReviewComments(reviewId, updateDto);
            expect(result).toEqual(updatedReview);
            expect(reviewRepository.findOneBy).toHaveBeenCalledWith({ review_id: reviewId });
            expect(reviewRepository.save).toHaveBeenCalledWith(existingReview);
        });

        it('should update only comments when overall_score is not provided', async () => {
            const reviewId = 1;
            const updateDto = { comments: "Updated only comments" };
            const existingReview = { review_id: reviewId, comments: "Old comments", overall_score: 80 } as Review;
            jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValue(existingReview);
            const updatedReview = { ...existingReview, ...updateDto };
            jest.spyOn(reviewRepository, 'save').mockResolvedValue(updatedReview);

            const result = await service.updateReviewComments(reviewId, updateDto);
            expect(result).toEqual(updatedReview);
            expect(reviewRepository.findOneBy).toHaveBeenCalledWith({ review_id: reviewId });
            expect(reviewRepository.save).toHaveBeenCalledWith(existingReview);
        });

        it('should throw NotFoundException if review not found', async () => {
            jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValue(null);
            await expect(service.updateReviewComments(1, { comments: "Something" })).rejects.toThrow(NotFoundException);
            expect(reviewRepository.findOneBy).toHaveBeenCalledWith({ review_id: 1 });
        });
    });

    describe('submitReview', () => {
        it('should mark review as submitted and return updated review', async () => {
            const reviewId = 1;
            const existingReview = { review_id: reviewId, submitted: false } as unknown as Review;
            jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValue(existingReview);
            const updatedReview = { ...existingReview, submitted: true };
            jest.spyOn(reviewRepository, 'save').mockResolvedValue(updatedReview);

            const result = await service.submitReview(reviewId);
            expect(result).toEqual(updatedReview);
            expect(reviewRepository.findOneBy).toHaveBeenCalledWith({ review_id: reviewId });
            expect(reviewRepository.save).toHaveBeenCalledWith(existingReview);
        });

        it('should throw NotFoundException if review not found', async () => {
            jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValue(null);
            await expect(service.submitReview(1)).rejects.toThrow(NotFoundException);
            expect(reviewRepository.findOneBy).toHaveBeenCalledWith({ review_id: 1 });
        });
    });
});
