import { Test, TestingModule } from '@nestjs/testing';
import { CreateFacultyMetricDto } from 'src/dto/create-faculty-metric.dto';
import { UpdateFacultyMetricDto } from 'src/dto/update-faculty-metric.dto';
import { FacultyMetricsController } from 'src/modules/faculty-metrics/faculty-metrics.controller';
import { FacultyMetricsService } from 'src/modules/faculty-metrics/faculty-metrics.service';

describe('FacultyMetricsController', () => {
  let controller: FacultyMetricsController;
  let service: FacultyMetricsService;

  const mockService = {
    getMetricsByFaculty: jest.fn(),
    createMetric: jest.fn(),
    updateMetric: jest.fn(),
    deleteMetric: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacultyMetricsController],
      providers: [
        {
          provide: FacultyMetricsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FacultyMetricsController>(FacultyMetricsController);
    service = module.get<FacultyMetricsService>(FacultyMetricsService);
  });

  describe('getMetrics', () => {
    it('should return an array of metrics', async () => {
      const metrics = [{ faculty_metric_id: 1, metric_name: 'GPA' }];
      mockService.getMetricsByFaculty.mockResolvedValue(metrics);

      expect(await controller.getMetrics(1)).toEqual(metrics);
      expect(mockService.getMetricsByFaculty).toHaveBeenCalledWith(1);
    });
  });

  describe('createMetric', () => {
    it('should create a new metric and return it', async () => {
      const dto: CreateFacultyMetricDto = {
        faculty_id: 1,
        metric_name: 'GPA',
        description: 'Grade Point Average',
        default_weight: 3.2,
      };
      const createdMetric = { faculty_metric_id: 1, ...dto };
      mockService.createMetric.mockResolvedValue(createdMetric);

      expect(await controller.createMetric(dto)).toEqual(createdMetric);
      expect(mockService.createMetric).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateMetric', () => {
    it('should update a metric and return the updated object', async () => {
      const dto: UpdateFacultyMetricDto = { metric_name: 'New Name', default_weight: 3.5 };
      const updatedMetric = { faculty_metric_id: 1, ...dto, description: 'desc' };
      mockService.updateMetric.mockResolvedValue(updatedMetric);

      expect(await controller.updateMetric(1, dto)).toEqual(updatedMetric);
      expect(mockService.updateMetric).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteMetric', () => {
    it('should delete a metric and return a success object', async () => {
      const expectedResponse = { success: true };
      mockService.deleteMetric.mockResolvedValue(expectedResponse);
      const result = await controller.deleteMetric(1);

      expect(mockService.deleteMetric).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });
  });
});
