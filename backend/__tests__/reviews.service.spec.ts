import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ReviewsService } from 'src/modules/reviews/reviews.service';
import { Review } from 'src/entity/review.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Application } from 'src/entity/application.entity';
import { Template } from 'src/entity/template.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { UpdateReviewDto } from 'src/dto/update-review.dto';
import { Departments } from 'src/modules/templates/departments.enum';

describe('ReviewsService', () => {
    let service: ReviewsService;
    let reviewRepo: Repository<Review>;
    let facultyRepo: Repository<Faculty>;
    let applicationRepo: Repository<Application>;
    let templateRepo: Repository<Template>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewsService,
                {
                    provide: getRepositoryToken(Review),
                    useValue: {
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Faculty),
                    useValue: { findOneBy: jest.fn() },
                },
                {
                    provide: getRepositoryToken(Application),
                    useValue: { findOneBy: jest.fn() },
                },
                {
                    provide: getRepositoryToken(Template),
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get(ReviewsService);
        reviewRepo = module.get(getRepositoryToken(Review));
        facultyRepo = module.get(getRepositoryToken(Faculty));
        applicationRepo = module.get(getRepositoryToken(Application));
        templateRepo = module.get(getRepositoryToken(Template));
    });

    describe('getReviewScores', () => {
        it('should return computed overall_score and faculty_score', async () => {
            const fakeReview = {
                review_id: 42,
                review_metrics: [
                    { template_weight: 2, selected_weight: 3, value: 1 } as ReviewMetric,
                    { template_weight: 0.5, selected_weight: 1.5, value: 4 } as ReviewMetric,
                ],
            } as Review;

            (reviewRepo.findOne as jest.Mock).mockResolvedValue(fakeReview);
            const result = await service.getReviewScores(42);

            expect(reviewRepo.findOne).toHaveBeenCalledWith({
                where: { review_id: 42 },
                relations: ['review_metrics'],
            });
            expect(result).toEqual({
                overall_score: 80,
                faculty_score: 180,
            });
        });

        it('should throw if review not found', async () => {
            (reviewRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.getReviewScores(99)).rejects.toThrow(NotFoundException);
            expect(reviewRepo.findOne).toHaveBeenCalledWith({
                where: { review_id: 99 },
                relations: ['review_metrics'],
            });
        });
    });

    describe('createReview', () => {
        const dto: CreateReviewDto = {
            faculty_id: 1,
            application_id: 2,
            department: 'ECE' as Departments,
        };

        it('successfully creates review with metrics from template', async () => {
            const faculty = { faculty_id: 1 } as Faculty;
            const application = { application_id: 2 } as Application;
            const template = {
                department: 'ECE',
                metrics: [
                    { metric_name: 'Comm', metric_weight: '0.5' },
                    { metric_name: 'Exp', metric_weight: '0.3' },
                ],
            } as any as Template;

            const created = { faculty, application, review_metrics: [], template } as unknown as Review;
            const saved = { ...created, review_id: 7 } as Review;

            (facultyRepo.findOneBy as jest.Mock).mockResolvedValue(faculty);
            (applicationRepo.findOneBy as jest.Mock).mockResolvedValue(application);
            (templateRepo.findOne as jest.Mock)
                .mockResolvedValueOnce(template)            // department lookup
                .mockResolvedValue(null);                   // default lookup
            (reviewRepo.create as jest.Mock).mockReturnValue(created);
            (reviewRepo.save as jest.Mock).mockResolvedValue(saved);

            const result = await service.createReview(dto);

            expect(facultyRepo.findOneBy).toHaveBeenCalledWith({ faculty_id: 1 });
            expect(applicationRepo.findOneBy).toHaveBeenCalledWith({ application_id: 2 });
            expect(templateRepo.findOne).toHaveBeenCalledWith({
                where: { department: 'ECE' },
                relations: ['metrics'],
            });
            expect(reviewRepo.create).toHaveBeenCalledWith({
                faculty,
                application,
                review_metrics: [],
                template,
            });

            // metrics initialized
            expect((created.review_metrics as ReviewMetric[]).map(m => ({
                name: m.name,
                selected_weight: m.selected_weight,
                template_weight: m.template_weight,
                value: m.value,
            }))).toEqual([
                { name: 'Comm', selected_weight: 0.5, template_weight: 0.5, value: 0 },
                { name: 'Exp', selected_weight: 0.3, template_weight: 0.3, value: 0 },
            ]);

            expect(reviewRepo.save).toHaveBeenCalledWith(created);
            expect(result).toEqual(saved);
        });

        it('throws if faculty missing', async () => {
            (facultyRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            await expect(service.createReview(dto)).rejects.toThrow(NotFoundException);
        });

        it('throws if application missing', async () => {
            (facultyRepo.findOneBy as jest.Mock).mockResolvedValue({} as Faculty);
            (applicationRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            await expect(service.createReview(dto)).rejects.toThrow(NotFoundException);
        });

        it('throws if no template found', async () => {
            (facultyRepo.findOneBy as jest.Mock).mockResolvedValue({} as Faculty);
            (applicationRepo.findOneBy as jest.Mock).mockResolvedValue({} as Application);
            (templateRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.createReview(dto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateReview', () => {
        const reviewId = 5;
        const dto: UpdateReviewDto = {
            comments: 'New comments',
            overall_score: 88,
            review_metrics: [
                { review_metric_id: 1, selected_weight: 0.7, value: 3 },
            ],
        };

        it.skip('updates and saves fields correctly', async () => {
            const existing = {
                review_id: reviewId,
                comments: 'Old',
                overall_score: 50,
                review_metrics: [
                    { review_metric_id: 1, name: 'A', selected_weight: 0.5, template_weight: 0.5, value: 2 },
                ],
                application: {
                    status: 'submitted'
                },
            } as any as Review;

            const updated = {
                ...existing,
                comments: dto.comments,
                overall_score: dto.overall_score,
                review_metrics: [
                    { review_metric_id: 1, name: 'A', selected_weight: 0.7, template_weight: 0.5, value: 3 },
                ],
            } as Review;

            (reviewRepo.findOne as jest.Mock).mockResolvedValue(existing);
            (reviewRepo.save as jest.Mock).mockResolvedValue(updated);

            const result = await service.updateReview(reviewId, dto);

            expect(reviewRepo.findOne).toHaveBeenCalledWith({
                where: { review_id: reviewId },
                relations: ['review_metrics'],
            });
            expect(reviewRepo.save).toHaveBeenCalledWith(existing);
            expect(result).toEqual(updated);
        });

        it('throws if review not found', async () => {
            (reviewRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.updateReview(123, {} as any)).rejects.toThrow(NotFoundException);
        });
    });

    describe('submitReview', () => {
        it.skip('marks submitted and returns', async () => {
            const reviewId = 9;
            const existing = {
                review_id: reviewId,
                submitted: false,
                review_metrics: [],
                application: {
                    status: 'submitted'
                },
            } as any as Review;

            const saved = {
                review_id: reviewId,
                submitted: true,
            } as Review;

            (reviewRepo.findOneBy as jest.Mock).mockResolvedValue(existing);
            (reviewRepo.save as jest.Mock).mockResolvedValue(saved);

            const result = await service.submitReview(reviewId);

            expect(reviewRepo.findOneBy).toHaveBeenCalledWith({ review_id: reviewId });
            expect(reviewRepo.save).toHaveBeenCalledWith(existing);
            expect(result).toEqual(saved);
        });

        it.skip('throws if review missing', async () => {
            (reviewRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            await expect(service.submitReview(99)).rejects.toThrow(NotFoundException);
            expect(reviewRepo.findOneBy).toHaveBeenCalledWith({ review_id: 99 });
        });
    });
});
