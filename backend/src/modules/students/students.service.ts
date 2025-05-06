import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/entity/application.entity';
import { Review } from 'src/entity/review.entity';
import { Student } from 'src/entity/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  async getApplicants(): Promise<any[]> {
    // This query is messy, but essentially it grabs all students with applications with a status of 'submitted'
    // Then it will also find the department/degree program for each application in case a student has multiple applications
    const rawApplicants = await this.studentRepo
      .createQueryBuilder('student')
      .innerJoin('student.applications', 'application')
      //.where('application.status = :status', { status: 'submitted' })
      .select([
        'application.application_id AS application_id',
        'student.student_id AS student_id',
        "CONCAT(student.first_name, ' ', student.last_name) AS full_name",
        'application.status AS status',
        'application.department AS department',
        'application.degree_program AS degree_program',
      ])
      .orderBy('student.student_id')
      .addOrderBy('application.submission_date', 'DESC')
      .getRawMany();

    return rawApplicants;
  }

  async getApplications(id: number): Promise<object> {
    const applications = await this.applicationRepo.find({
      where: { student: { student_id: id } },
      relations: ['student', 'reviews'],
    });

    const cleanApplications: CleanApplication[] = [];
    for (let i = 0; i < applications.length; i++) {
      const clean: CleanApplication = {
        ...applications[i],
        isReviewed: (applications[i].reviews.length || 0) > 0,
      };

      delete clean.reviews;
      cleanApplications.push(clean);
    }

    return cleanApplications;
  }

  async getStudentInfo(id: number): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { student_id: id },
      relations: [
        'applications',
        'applications.documents',
        'applications.reviews',
      ],
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return student;
  }
}

/**
 * Helper interface so that eslint stops yelling at me
 */
interface CleanApplication extends Omit<Application, 'reviews'> {
  reviews?: Review[] | null;
  isReviewed: boolean;
}
