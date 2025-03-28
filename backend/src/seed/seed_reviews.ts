import { DataSource } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Student } from 'src/entity/student.entity';
import { Application } from 'src/entity/application.entity';
import { Document } from 'src/entity/document.entity';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Review } from 'src/entity/review.entity';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from 'src/common/logger/logger.service';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGSQL_HOST || 'localhost',
  port: Number(process.env.PGSQL_PORT) || 5432,
  username: process.env.PGSQL_USER || 'postgres',
  password: process.env.PGSQL_PASSWORD || 'password',
  database: process.env.PGSQL_DATABASE || 'gapdb',
  entities: [
    Application,
    Document,
    FacultyMetric,
    Faculty,
    ReviewMetric,
    Review,
    Session,
    Student,
    User,
  ],
  synchronize: false,
});

export async function seedReviews(logger: LoggerService) {
  await dataSource.initialize();
  const reviewRepo = dataSource.getRepository(Review);
  const facultyRepo = dataSource.getRepository(Faculty);
  const applicationRepo = dataSource.getRepository(Application);
  const dirname = __dirname.replace('dist', '');

  // Remove previously stored data
  await dataSource.query(`TRUNCATE TABLE "reviews" RESTART IDENTITY CASCADE`);

  const reviewsDataPath = path.join(dirname, 'data', 'reviews.json');
  const reviewsData = JSON.parse(fs.readFileSync(reviewsDataPath, 'utf-8'));

  for (const reviewData of reviewsData) {
    const faculty = await facultyRepo.findOneBy({
      faculty_id: reviewData.faculty_id,
    });
    const application = await applicationRepo.findOneBy({
      application_id: reviewData.application_id,
    });
    if (!faculty || !application) {
      console.warn(
        `Skipping review: Faculty ${reviewData.faculty_id} or Application ${reviewData.application_id} not found`,
      );
      continue;
    }

    const newReview = reviewRepo.create({
      faculty,
      application,
      overall_score: reviewData.overall_score || null,
      comments: reviewData.comments || null,
      review_metrics: [],
    });
    await reviewRepo.save(newReview);
  }

  logger.debug('Reviews seeded successfully.');
  await dataSource.destroy();
}
