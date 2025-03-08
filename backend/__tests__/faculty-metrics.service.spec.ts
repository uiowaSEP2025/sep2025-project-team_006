import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { FacultyMetric } from 'src/entity/faculty_metric.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateFacultyMetricDto } from 'src/dto/create-faculty-metric.dto';
import { UpdateFacultyMetricDto } from 'src/dto/update-faculty-metric.dto';
import { FacultyMetricsService } from 'src/modules/faculty-metrics/faculty-metrics.service';

describe('FacultyMetricsService', () => {
  let service: FacultyMetricsService;
  let facultyMetricRepo: Repository<FacultyMetric>;
  let facultyRepo: Repository<Faculty>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacultyMetricsService,
        {
          provide: getRepositoryToken(FacultyMetric),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Faculty),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FacultyMetricsService>(FacultyMetricsService);
    facultyMetricRepo = module.get<Repository<FacultyMetric>>(getRepositoryToken(FacultyMetric));
    facultyRepo = module.get<Repository<Faculty>>(getRepositoryToken(Faculty));
  });

  describe('getMetricsByFaculty', () => {
    it('should return metrics for a faculty', async () => {
      const facultyId = 1;
      const expectedMetrics = [{ faculty_metric_id: 1, metric_name: 'GPA' }];
      (facultyMetricRepo.find as jest.Mock).mockResolvedValue(expectedMetrics);

      const result = await service.getMetricsByFaculty(facultyId);
      expect(result).toEqual(expectedMetrics);
      expect(facultyMetricRepo.find).toHaveBeenCalledWith({
        where: { faculty: { faculty_id: facultyId } },
        order: { faculty_metric_id: 'ASC' },
      });
    });
  });

  describe('createMetric', () => {
    it('should throw NotFoundException if faculty not found', async () => {
      const createDto: CreateFacultyMetricDto = {
        faculty_id: 1,
        metric_name: 'GPA',
        description: 'Grade Point Average',
        default_weight: 3.2,
      };
      (facultyRepo.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.createMetric(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should create and return a new metric', async () => {
      const createDto: CreateFacultyMetricDto = {
        faculty_id: 1,
        metric_name: 'GPA',
        description: 'Grade Point Average',
        default_weight: 3.2,
      };
      const faculty = { faculty_id: 1 } as Faculty;
      const newMetric = { faculty_metric_id: 1, ...createDto, faculty };

      (facultyRepo.findOneBy as jest.Mock).mockResolvedValue(faculty);
      (facultyMetricRepo.create as jest.Mock).mockReturnValue(newMetric);
      (facultyMetricRepo.save as jest.Mock).mockResolvedValue(newMetric);

      const result = await service.createMetric(createDto);
      expect(result).toEqual(newMetric);
      expect(facultyRepo.findOneBy).toHaveBeenCalledWith({ faculty_id: createDto.faculty_id });
    });
  });

  describe('updateMetric', () => {
    it('should throw NotFoundException if metric not found', async () => {
      (facultyMetricRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.updateMetric(1, { metric_name: 'New Name' } as UpdateFacultyMetricDto)).rejects.toThrow(NotFoundException);
    });

    it('should update and return the metric', async () => {
      const existingMetric = { faculty_metric_id: 1, metric_name: 'Old Name', description: 'desc', default_weight: 3.2 };
      const updateDto: UpdateFacultyMetricDto = { metric_name: 'New Name', default_weight: 3.5 };

      (facultyMetricRepo.findOne as jest.Mock).mockResolvedValue(existingMetric);
      (facultyMetricRepo.save as jest.Mock).mockResolvedValue({ ...existingMetric, ...updateDto });

      const result = await service.updateMetric(1, updateDto);
      expect(result).toEqual({ ...existingMetric, ...updateDto });
      expect(facultyMetricRepo.findOne).toHaveBeenCalledWith({ where: { faculty_metric_id: 1 } });
    });
  });

  describe('deleteMetric', () => {
    it('should throw NotFoundException if metric is not found', async () => {
      (facultyMetricRepo.findOne as jest.Mock).mockResolvedValue(null);
  
      await expect(service.deleteMetric(1)).rejects.toThrowError(
        'Metric with id 1 not found',
      );
      expect(facultyMetricRepo.findOne).toHaveBeenCalledWith({
        where: { faculty_metric_id: 1 },
      });
    });
  
    it('should delete the metric and return a success object', async () => {
      const metric = { faculty_metric_id: 1 };
      (facultyMetricRepo.findOne as jest.Mock).mockResolvedValue(metric);
      (facultyMetricRepo.remove as jest.Mock).mockResolvedValue(metric);
  
      const result = await service.deleteMetric(1);
      expect(result).toEqual({ message: "Faculty metric ID: 1, has been deleted.", });
      expect(facultyMetricRepo.findOne).toHaveBeenCalledWith({
        where: { faculty_metric_id: 1 },
      });
      expect(facultyMetricRepo.remove).toHaveBeenCalledWith(metric);
    });
  });
});
