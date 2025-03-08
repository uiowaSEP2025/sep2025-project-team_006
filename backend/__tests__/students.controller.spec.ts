import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StudentsService } from 'src/modules/students/students.service';
import { StudentsController } from 'src/modules/students/students.controller';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockService = {
    getApplicants: jest.fn(),
    getStudentInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  describe('getApplicants', () => {
    it('should return an array of applicant objects', async () => {
      const applicants = [
        { student_id: 1, full_name: 'Alice Smith', status: 'submitted', department: 'ECE', degree_program: 'M.S.' },
        { student_id: 2, full_name: 'Bob Jones', status: 'submitted', department: 'ECE', degree_program: 'Ph.D.' },
      ];
      mockService.getApplicants.mockResolvedValue(applicants);

      const result = await controller.getApplicants();
      expect(result).toEqual(applicants);
      expect(mockService.getApplicants).toHaveBeenCalled();
    });
  });

  describe('getStudentInfo', () => {
    it('should return student details when given a valid id', async () => {
      const studentInfo = {
        student_id: 1,
        first_name: 'Alice',
        last_name: 'Smith',
        phone_number: '1234567890',
        address: '123 Main St',
        applications: [],
      };
      mockService.getStudentInfo.mockResolvedValue(studentInfo);

      const result = await controller.getStudentInfo(1);
      expect(result).toEqual(studentInfo);
      expect(mockService.getStudentInfo).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if student is not found', async () => {
      mockService.getStudentInfo.mockRejectedValue(new NotFoundException('Student with id 999 not found'));
      await expect(controller.getStudentInfo(999)).rejects.toThrow(NotFoundException);
    });
  });
});
