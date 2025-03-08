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

export async function seedApplications() {
  await dataSource.initialize();
  const studentRepo = dataSource.getRepository(Student);
  const applicationRepo = dataSource.getRepository(Application);
  const dirname = __dirname.replace('dist', 'src');

  const applicationsDataPath = path.join(dirname, 'data', 'applications.json');
  const applications = JSON.parse(
    fs.readFileSync(applicationsDataPath, 'utf-8'),
  );

  const students = await studentRepo.find({ relations: ['applications'] });
  const applicantStudents = students.slice(0, 15);
  let appIndex = 0;

  // First student gets 2 applications
  const student = applicantStudents[0];
  for (let i = 0; i < 2 && appIndex < applications.length; i++) {
    const appData = applications[appIndex++];
    const newApplication = applicationRepo.create({
      status: appData.status,
      submission_date: new Date(appData.submission_date),
      department: appData.department,
      degree_program: appData.degree_program,
      student: student,
    });
    await applicationRepo.save(newApplication);
  }

  // The rest of the students get 1 application each
  for (
    let i = 1;
    i < applicantStudents.length && appIndex < applications.length;
    i++
  ) {
    const student = applicantStudents[i];
    const appData = applications[appIndex++];
    const newApplication = applicationRepo.create({
      status: appData.status,
      submission_date: new Date(appData.submission_date),
      department: appData.department,
      degree_program: appData.degree_program,
      student: student,
    });
    await applicationRepo.save(newApplication);
  }

  console.log('Applications seeded successfully.');
  await dataSource.destroy();
}
