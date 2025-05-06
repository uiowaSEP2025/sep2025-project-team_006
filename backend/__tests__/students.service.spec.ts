import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Student } from 'src/entity/student.entity';
import { Application } from 'src/entity/application.entity';     // ← import your Application entity
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { StudentsService } from 'src/modules/students/students.service';

describe('StudentsService', () => {
  let service: StudentsService;
  let studentRepo: Repository<Student>;
  let appRepo: Repository<Application>;                         // ← placeholder for Application repo

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Application),               // ← add this provider
          useValue: {
            // no methods actually invoked in your two tests, so an empty mock suffices
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service     = module.get<StudentsService>(StudentsService);
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    appRepo     = module.get<Repository<Application>>(getRepositoryToken(Application));
  });

  describe('getApplicants', () => {
    it('should return an array of raw applicant objects', async () => {
      const expectedApplicants = [
        {
          student_id: 1,
          full_name: 'Alice Smith',
          status: 'submitted',
          department: 'ECE',
          degree_program: 'M.S.',
        },
        {
          student_id: 2,
          full_name: 'Bob Jones',
          status: 'submitted',
          department: 'ECE',
          degree_program: 'Ph.D.',
        },
      ];

      const fakeQB: Partial<SelectQueryBuilder<Student>> = {
        innerJoin: jest.fn().mockReturnThis(),
        where:     jest.fn().mockReturnThis(),
        select:    jest.fn().mockReturnThis(),
        orderBy:   jest.fn().mockReturnThis(),
        addOrderBy:jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(expectedApplicants),
      };
      (studentRepo.createQueryBuilder as jest.Mock).mockReturnValue(fakeQB);

      const result = await service.getApplicants();
      expect(result).toEqual(expectedApplicants);
      expect(studentRepo.createQueryBuilder).toHaveBeenCalledWith('student');
      expect(fakeQB.getRawMany).toHaveBeenCalled();
    });
  });

  describe('getStudentInfo', () => {
    it('should return the student if found', async () => {
      const studentData = {
        student_id: 1,
        first_name: 'Alice',
        last_name:  'Smith',
        phone_number: '1234567890',
        address:     '123 Main St',
        applications: [],
      } as unknown as Student;

      (studentRepo.findOne as jest.Mock).mockResolvedValue(studentData);

      const result = await service.getStudentInfo(1);
      expect(result).toEqual(studentData);
      expect(studentRepo.findOne).toHaveBeenCalledWith({
        where:     { student_id: 1 },
        relations: ['applications', 'applications.documents', 'applications.reviews'],
      });
    });

    it('should throw a NotFoundException if the student is not found', async () => {
      (studentRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.getStudentInfo(999)).rejects.toThrow(NotFoundException);
    });
  });
});
