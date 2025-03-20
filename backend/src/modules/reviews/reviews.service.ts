import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Review } from 'src/entity/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(Faculty)
        private facultyRepository: Repository<Faculty>,
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
    ) { }

    async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
        const { faculty_id, application_id } = createReviewDto;

        const faculty = await this.facultyRepository.findOneBy({ faculty_id });
        if (!faculty) {
            throw new NotFoundException(`Faculty not found for id ${faculty_id}`);
        }

        const application = await this.applicationRepository.findOneBy({ application_id });
        if (!application) {
            throw new NotFoundException(`Application not found for id ${application_id}`);
        }

        const review = this.reviewRepository.create({
            faculty,
            application,
            review_metrics: [],
        });

        return this.reviewRepository.save(review);
    }
}
