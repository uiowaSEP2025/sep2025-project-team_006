import { DataSource } from 'typeorm';
import { Faculty } from 'src/entity/faculty.entity';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Review } from 'src/entity/review.entity';
import { Application } from 'src/entity/application.entity';
import { Document } from 'src/entity/document.entity';
import { ReviewMetric } from 'src/entity/review_metric.entity';
import { Session } from 'src/entity/session.entity';
import { Student } from 'src/entity/student.entity';
import { User } from 'src/entity/user.entity';

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

export async function seedFacultyMetrics() {
    await dataSource.initialize();
    const facultyMetricRepo = dataSource.getRepository(FacultyMetric);
    const facultyRepo = dataSource.getRepository(Faculty);
    const dirname = __dirname.replace('dist', 'src'); // the __dirname likes to grab from the /dist/ directory instead so we want local files

    // remove previously stored data
    await dataSource.query(
        `TRUNCATE TABLE "faculty_metrics" RESTART IDENTITY CASCADE`,
    );

    const facultyDataPath = path.join(dirname, 'data', 'faculty_metrics.json');
    const facultyMetrics = JSON.parse(fs.readFileSync(facultyDataPath, 'utf-8'));

    // this is ran after the user seeding so these should all exist
    const faculties = await facultyRepo.find({ order: { faculty_id: 'ASC' } });

    const metricsPerFaculty = 5;
    const numberOfFacultiesForMetrics = faculties.length - 1; // last faculty gets no metrics

    for (let i = 0; i < numberOfFacultiesForMetrics; i++) {
        const faculty = faculties[i];
        // Calculate the slice for this faculty:
        const startIndex = i * metricsPerFaculty;
        const endIndex = startIndex + metricsPerFaculty;
        const metricsForFaculty = facultyMetrics.slice(startIndex, endIndex);

        for (const metric of metricsForFaculty) {
            const newMetric = facultyMetricRepo.create({
                metric_name: metric.metric_name,
                description: metric.description,
                default_weight: metric.default_weight,
                faculty: faculty,
            });
            await facultyMetricRepo.save(newMetric);
        }
    }

    console.log('Faculty metrics seeded successfully.');
    await dataSource.destroy();
}
