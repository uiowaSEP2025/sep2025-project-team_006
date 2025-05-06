import { Test, TestingModule }         from '@nestjs/testing';
import { NotFoundException }           from '@nestjs/common';
import { Repository, ObjectLiteral }   from 'typeorm';
import { getRepositoryToken }          from '@nestjs/typeorm';

import { ApplicationsService }         from 'src/modules/applications/applications.service';
import { Application }                 from 'src/entity/application.entity';
import { Student }                     from 'src/entity/student.entity';
import { CreateApplicationDto }        from 'src/dto/create-application.dto';

// --- 1) A reusable mock‑repo type and factory
type MockRepository<T extends ObjectLiteral = any> =
  Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create:  jest.fn(),
  save:    jest.fn(),
});

describe('ApplicationsService', () => {
  let service:    ApplicationsService;
  let appRepo:    MockRepository<Application>;
  let studentRepo:MockRepository<Student>;

  // --- 2) Reset mocks before each test
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: createMockRepository<Application>(),
        },
        {
          provide: getRepositoryToken(Student),
          useValue: createMockRepository<Student>(),
        },
      ],
    }).compile();

    service     = module.get(ApplicationsService);
    appRepo     = module.get(getRepositoryToken(Application));
    studentRepo = module.get(getRepositoryToken(Student));
  });

  describe('createApplication', () => {
    const dto: CreateApplicationDto = {
      student_id:     42,
      department:     'ECE',
      degree_program: 'MS',
    };

    it('throws NotFoundException when no student is found', async () => {
      // Service calls studentRepository.findOne({ where:… }) :contentReference[oaicite:0]{index=0}
      studentRepo.findOne!.mockResolvedValue(null);

      await expect(service.createApplication(dto))
        .rejects
        .toBeInstanceOf(NotFoundException);
    });

    it('creates, saves & returns a new Application when student exists', async () => {
      // 1) Stub out the student lookup
      const mockStudent = {
        student_id:   dto.student_id,
        applications: [],
      } as unknown as Student;
      studentRepo.findOne!.mockResolvedValue(mockStudent);

      // 2) Prepare the fake Application that our repo will build & save
      const mockApp = {
        application_id: 99,
        department:     dto.department,
        degree_program: dto.degree_program,
        student:        mockStudent,
        status:         'submitted',
      } as Application;

      appRepo.create!.mockReturnValue(mockApp);
      appRepo.save!.mockResolvedValue(mockApp);

      // 3) Call the service
      const result = await service.createApplication(dto);

      // 4) Verify it created with exactly these props…
      expect(appRepo.create).toHaveBeenCalledWith({
        department:     dto.department,
        degree_program: dto.degree_program,
        student:        mockStudent,
        status:         'submitted',
      });

      // …then saved them…
      expect(appRepo.save).toHaveBeenCalledWith(mockApp);

      // …and returned the saved entity…
      expect(result).toBe(mockApp);

      // …and that it pushed the new app onto student.applications
      expect(mockStudent.applications).toContain(mockApp);
    });
  });
});
