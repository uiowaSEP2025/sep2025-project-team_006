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
import { TemplateMetric } from 'src/entity/template_metric.entity';
import { Template } from 'src/entity/template.entity';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from 'src/common/logger/logger.service';
import * as dotenv from 'dotenv';

dotenv.config();

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
    TemplateMetric,
    Template,
    Session,
    Student,
    User,
  ],
  synchronize: false,
});

export async function seedReviews(logger: LoggerService) {
  try {
    await dataSource.initialize();
    const reviewRepo = dataSource.getRepository(Review);
    const facultyRepo = dataSource.getRepository(Faculty);
    const applicationRepo = dataSource.getRepository(Application);
    const templateRepo = dataSource.getRepository(Template);
    const dirname = __dirname.replace('dist', ''); // Adjust for local development

    // Remove previously stored review data (cascade deletes review_metrics)
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
        logger.debug(
          `Skipping review: Faculty ${reviewData.faculty_id} or Application ${reviewData.application_id} not found`,
        );
        continue;
      }

      let template = await templateRepo.findOne({
        where: { department: reviewData.department },
        relations: ['metrics'],
      });
      if (!template) {
        template = await templateRepo.findOne({
          where: { is_default: true },
          relations: ['metrics'],
        });
      }
      if (!template) {
        logger.debug(
          `No template found for review in department ${reviewData.department}`,
        );
        continue;
      }

      const newReview = reviewRepo.create({
        faculty,
        application,
        template,
        overall_score: reviewData.overall_score || null,
        comments: reviewData.comments || null,
        submitted: reviewData.submitted || false,
        review_metrics: [], // Will be populated using template metrics
      });

      if (template.metrics && template.metrics.length > 0) {
        newReview.review_metrics = template.metrics.map(
          (tm: TemplateMetric) =>
            ({
              name: tm.metric_name,
              selected_weight: parseFloat(tm.metric_weight),
              template_weight: parseFloat(tm.metric_weight),
              value: 0,
            }) as ReviewMetric,
        );
      }

      await reviewRepo.save(newReview);
    }

    logger.debug('Reviews seeded successfully.');
  } catch (error) {
    logger.debug('Error seeding reviews: ' + error);
  } finally {
    await dataSource.destroy();
  }
}
