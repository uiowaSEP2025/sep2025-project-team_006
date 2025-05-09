import { seedUserDatabase } from './seed_users';
import { seedFacultyMetrics } from './seed_faculty_metrics';
import { seedApplications } from './seed_applications';
import { seedDocuments } from './seed_documents';
import { seedReviews } from './seed_reviews';
import { LoggerService } from 'src/common/logger/logger.service';
import { seedTemplates } from './seed_templates';

/**
 * Job: Holds all seed scripts to run from an NPM command
 */
async function runSeeders() {
  const logger = new LoggerService();

  try {
    await seedUserDatabase(logger);
    await seedFacultyMetrics(logger);
    await seedApplications(logger);
    await seedDocuments(logger);
    await seedTemplates(logger);
    await seedReviews(logger);
    logger.log('All seeders executed successfully.');
  } catch (err) {
    logger.error('Error while running seeders', err);
    process.exit(1);
  }
}

runSeeders();
