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

export async function seedReviewMetrics() {
  await dataSource.initialize();
  const reviewMetricRepo = dataSource.getRepository(ReviewMetric);
  const reviewRepo = dataSource.getRepository(Review);
  const dirname = __dirname.replace('dist', 'src');

  // Remove previously stored data
  await dataSource.query(
    `TRUNCATE TABLE "review_metrics" RESTART IDENTITY CASCADE`,
  );

  const reviewMetricsDataPath = path.join(
    dirname,
    'data',
    'review_metrics.json',
  );
  const reviewMetricsData = JSON.parse(
    fs.readFileSync(reviewMetricsDataPath, 'utf-8'),
  );

  for (const metricData of reviewMetricsData) {
    // Ensure that the associated review exists
    const review = await reviewRepo.findOneBy({
      review_id: metricData.review_id,
    });
    if (!review) {
      console.warn(
        `Skipping metric for Review ${metricData.review_id}: Review not found`,
      );
      continue;
    }

    const newMetric = reviewMetricRepo.create({
      review: { review_id: metricData.review_id } as Review,
      name: metricData.name,
      description: metricData.description,
      selected_weight: metricData.selected_weight,
      value: metricData.value,
    });
    await reviewMetricRepo.save(newMetric);
  }

  console.log('Review metrics seeded successfully.');
  await dataSource.destroy();
}
