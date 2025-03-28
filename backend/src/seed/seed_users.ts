import { DataSource } from 'typeorm';
import { User, AccountType } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Student } from 'src/entity/student.entity';
import { Application } from 'src/entity/application.entity';
import { Document } from 'src/entity/document.entity';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Review } from 'src/entity/review.entity';
import * as bcrypt from 'bcrypt';
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

export async function seedUserDatabase(logger: LoggerService) {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const facultyRepo = dataSource.getRepository(Faculty);
  const studentRepo = dataSource.getRepository(Student);
  const dirname = __dirname.replace('dist', 'src'); // the __dirname likes to grab from the /dist/ directory instead so we want local files

  // remove previously stored data
  await dataSource.query(`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "faculty" RESTART IDENTITY CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "students" RESTART IDENTITY CASCADE`);

  // seed faculty members - see `/data/faculty.json` to expand the data set
  const facultyDataPath = path.join(dirname, 'data', 'faculty.json');
  const facultyMembers = JSON.parse(fs.readFileSync(facultyDataPath, 'utf-8'));
  let facultyIndex = 1;
  for (const facultyData of facultyMembers) {
    const faculty = facultyRepo.create({
      first_name: facultyData.first_name,
      last_name: facultyData.last_name,
      phone_number: facultyData.phone_number,
      department: facultyData.department,
      job_title: facultyData.job_title,
      reviews: facultyData.reviews,
    });
    await facultyRepo.save(faculty);

    const providerId = `microsoft-faculty-${facultyIndex.toString().padStart(3, '0')}`;
    let userFaculty = await userRepo.findOne({
      where: { provider_id: facultyData.provider_id },
    });
    if (!userFaculty) {
      userFaculty = userRepo.create({
        account_type: AccountType.FACULTY,
        faculty: faculty, // link to faculty entity
        provider: 'Microsoft',
        provider_id: providerId,
        password_digest: bcrypt.hashSync('meaningless', bcrypt.genSaltSync(10)),
        email: facultyData.email,
      });
      await userRepo.save(userFaculty);
    }
    facultyIndex++;
  }

  // seed students - see `/data/student.json` to expand the data set
  const studentDataPath = path.join(dirname, 'data', 'students.json');
  const students = JSON.parse(fs.readFileSync(studentDataPath, 'utf-8'));
  let studentIndex = 1;
  for (const studentData of students) {
    const student = studentRepo.create({
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      phone_number: studentData.phone_number,
      address: studentData.address,
    });
    await studentRepo.save(student);

    const providerId = `google-student-${studentIndex.toString().padStart(3, '0')}`;
    let userStudent = await userRepo.findOne({
      where: { provider_id: providerId },
    });
    if (!userStudent) {
      userStudent = userRepo.create({
        account_type: AccountType.STUDENT,
        student: student, // link to student entity
        provider: 'Google',
        provider_id: providerId,
        password_digest: bcrypt.hashSync('meaningless', bcrypt.genSaltSync(10)),
        email: studentData.email,
      });
      await userRepo.save(userStudent);
    }
    studentIndex++;
  }

  await dataSource.destroy();
}
