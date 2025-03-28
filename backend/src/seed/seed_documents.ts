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

async function clearUploadsDirectory(directory: string): Promise<void> {
  try {
    const files = await fs.promises.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }
    console.log(`Deleted contents from ./uploads directory`);
  } catch (error) {
    console.error(`Error clearing directory ${directory}:`, error);
  }
}

export async function seedDocuments(logger: LoggerService) {
  await dataSource.initialize();
  const documentRepo = dataSource.getRepository(Document);
  const applicationRepo = dataSource.getRepository(Application);
  const dirname = __dirname.replace('dist', '');
  clearUploadsDirectory('../backend/uploads');

  const documentsDataPath = path.join(dirname, 'data', 'documents.json');
  const documentsFolder = path.join(dirname, 'documents');
  const documents = JSON.parse(fs.readFileSync(documentsDataPath, 'utf-8'));

  for (const doc of documents) {
    const filePath = path.join(documentsFolder, doc.file_name);
    if (!fs.existsSync(filePath)) {
      logger.warn(`File ${filePath} not found, skipping...`);
      continue;
    }

    const application = await applicationRepo.findOneBy({
      application_id: doc.application_id,
    });
    if (!application) {
      continue;
    }

    const newDocument = documentRepo.create({
      document_type: doc.document_type,
      file_path: filePath,
      application,
    });

    await documentRepo.save(newDocument);
    logger.debug(
      `Seeded document: ${doc.file_name} for application ${doc.application_id}`,
    );
  }
  logger.debug('Documents seeded successfully.');
  await dataSource.destroy();
}
