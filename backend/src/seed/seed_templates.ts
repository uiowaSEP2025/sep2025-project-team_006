import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { LoggerService } from 'src/common/logger/logger.service';
import { TemplateMetric } from 'src/entity/template_metric.entity';
import { Template } from 'src/entity/template.entity';
import { Departments } from 'src/modules/templates/departments.enum';
import { Application } from 'src/entity/application.entity';
import { Document } from 'src/entity/document.entity';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Review } from 'src/entity/review.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Student } from 'src/entity/student.entity';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';

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
export async function seedTemplates(logger: LoggerService) {
  try {
    await dataSource.initialize();
    const templateRepo = dataSource.getRepository(Template);
    const templateMetricRepo = dataSource.getRepository(TemplateMetric);
    const dirname = __dirname.replace('dist', '');

    await dataSource.query(
      `TRUNCATE TABLE "template_metrics" RESTART IDENTITY CASCADE`,
    );
    await dataSource.query(
      `TRUNCATE TABLE "templates" RESTART IDENTITY CASCADE`,
    );

    const templatesDataPath = path.join(dirname, 'data', 'templates.json');
    const templatesData = JSON.parse(
      fs.readFileSync(templatesDataPath, 'utf-8'),
    );

    for (const item of templatesData.templates) {
      const template = templateRepo.create({
        department: item.department as Departments,
        name: item.name,
        is_default: item.is_default,
      });
      await templateRepo.save(template);

      if (Array.isArray(item.metrics)) {
        for (const metric of item.metrics) {
          const newMetric = templateMetricRepo.create({
            metric_name: metric.metric_name,
            description: metric.description,
            metric_weight: metric.metric_weight.toString(),
            template: template,
          });
          await templateMetricRepo.save(newMetric);
        }
      }
    }

    logger.debug('Templates seeded successfully.');
  } catch (error) {
    logger.debug('Error seeding templates: ' + error);
  } finally {
    await dataSource.destroy();
  }
}
