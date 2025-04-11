import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from 'src/modules/reviews/reviews.service';
import { Review } from 'src/entity/review.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Application } from 'src/entity/application.entity';
import { Template } from 'src/entity/template.entity';
import { Departments } from 'src/modules/templates/departments.enum';
import { ReviewMetric } from 'src/entity/review_metric.entity';

describe('ReviewsService', () => {
    let service: ReviewsService;
    let reviewRepository: Repository<Review>;
    let facultyRepository: Repository<Faculty>;
    let applicationRepository: Repository<Application>;
    let templateRepository: Repository<Template>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewsService,
                {
                    provide: getRepositoryToken(Review),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
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
                {
                    provide: getRepositoryToken(Template),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ReviewsService>(ReviewsService);
        reviewRepository = module.get<Repository<Review>>(getRepositoryToken(Review));
        facultyRepository = module.get<Repository<Faculty>>(getRepositoryToken(Faculty));
        applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
        templateRepository = module.get<Repository<Template>>(getRepositoryToken(Template));
    });

    describe('createReview', () => {

        const createReviewDto = { faculty_id: 1, application_id: 2, department: 'ECE' as Departments };
        it('should create a review successfully with a template and instantiate metrics', async () => {
            const faculty = { faculty_id: 1 } as Faculty;
            const application = { application_id: 2 } as Application;
            const template = {
                template_id: '123',
                department: 'ECE',
                name: "Electrical and Computer Engineering Template",
                metrics: [
                    { metric_name: "Communication", metric_weight: "0.5" },
                    { metric_name: "Expertise", metric_weight: "0.3" }
                ]
            } as any as Template;
            const createdReview = { faculty, application, review_metrics: [] } as unknown as Review;
            const savedReview = { ...createdReview, review_id: 6 };

            jest.spyOn(facultyRepository, 'findOneBy').mockResolvedValue(faculty);
            jest.spyOn(applicationRepository, 'findOneBy').mockResolvedValue(application);
            // Make sure the service queries template with relations, so return our template
            jest.spyOn(templateRepository, 'findOne').mockImplementation((options: { where: any; relations?: string[]; }) => {
                // Cast options.where to the expected type.
                const condition = options.where as FindOptionsWhere<Template>;
                if (condition.department === createReviewDto.department) {
                    return Promise.resolve(template);
                }
                return Promise.resolve(null);
            });
            jest.spyOn(reviewRepository, 'create').mockReturnValue(createdReview);
            jest.spyOn(reviewRepository, 'save').mockResolvedValue(savedReview);

            const result = await service.createReview(createReviewDto);
            expect(result).toEqual(savedReview);
            expect(facultyRepository.findOneBy).toHaveBeenCalledWith({ faculty_id: createReviewDto.faculty_id });
            expect(applicationRepository.findOneBy).toHaveBeenCalledWith({ application_id: createReviewDto.application_id });
            expect(templateRepository.findOne).toHaveBeenCalledWith({
                where: { department: createReviewDto.department },
                relations: ['metrics'],
            });
            expect(reviewRepository.create).toHaveBeenCalledWith({
                faculty,
                application,
                review_metrics: [],
                template,
            });
            // Also check that the new review_metrics were instantiated based on the template's metrics.
            expect(createdReview.review_metrics).toEqual([
                { name: "Communication", selected_weight: 0.5, template_weight: 0.5, value: 0 },
                { name: "Expertise", selected_weight: 0.3, template_weight: 0.3, value: 0 }
            ]);
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

        it('should throw NotFoundException if no template is found', async () => {
            const faculty = { faculty_id: 1 } as Faculty;
            const application = { application_id: 2 } as Application;
            jest.spyOn(facultyRepository, 'findOneBy').mockResolvedValue(faculty);
            jest.spyOn(applicationRepository, 'findOneBy').mockResolvedValue(application);
            // Return null from both department and default lookup.
            jest.spyOn(templateRepository, 'findOne').mockResolvedValue(null);

            await expect(service.createReview(createReviewDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateReview', () => {
        it('should update review comments, overall_score and review metrics', async () => {
            const reviewId = 1;
            const updateDto = {
                comments: "Updated comments",
                overall_score: 90,
                review_metrics: [
                    { review_metric_id: 2, selected_weight: 0.5, value: 4 },
                    { review_metric_id: 3, selected_weight: 0.3, value: 4 }
                ]
            };
            const existingReview = {
                review_id: reviewId,
                comments: "Old comments",
                overall_score: 80,
                review_metrics: [
                    { review_metric_id: 2, name: "Communication", selected_weight: 0.4, template_weight: 0.5, value: 3 },
                    { review_metric_id: 3, name: "Expertise", selected_weight: 0.3, template_weight: 0.3, value: 4 }
                ]
            } as unknown as Review;
            jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(existingReview);
            const updatedReview = {
                ...existingReview,
                comments: updateDto.comments,
                overall_score: updateDto.overall_score,
                review_metrics: [
                    { review_metric_id: 2, name: "Communication", selected_weight: 0.5, template_weight: 0.5, value: 4 },
                    { review_metric_id: 3, name: "Expertise", selected_weight: 0.3, template_weight: 0.3, value: 4 }
                ]
            } as Review;
            jest.spyOn(reviewRepository, 'save').mockResolvedValue(updatedReview);

            const result = await service.updateReview(reviewId, updateDto);
            expect(result).toEqual(updatedReview);
            expect(reviewRepository.findOne).toHaveBeenCalledWith({
                where: { review_id: reviewId },
                relations: ['review_metrics'],
            });
            expect(reviewRepository.save).toHaveBeenCalledWith(existingReview);
        });

        it('should throw NotFoundException if review not found', async () => {
            jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(null);
            await expect(service.updateReview(1, { comments: "Something" })).rejects.toThrow(NotFoundException);
            expect(reviewRepository.findOne).toHaveBeenCalledWith({
                where: { review_id: 1 },
                relations: ['review_metrics'],
            });
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
