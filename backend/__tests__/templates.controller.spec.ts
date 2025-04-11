import { Test, TestingModule } from '@nestjs/testing';
import { CreateTemplateDto } from 'src/dto/create-template.dto';
import { UpdateTemplateDto } from 'src/dto/update-template.dto';
import { NotFoundException } from '@nestjs/common';
import { TemplateService } from 'src/modules/templates/templates.servive';
import { TemplateController } from 'src/modules/templates/templates.controller';
import { Departments } from 'src/modules/templates/departments.enum';

describe('TemplateController', () => {
  let controller: TemplateController;
  let service: TemplateService;

  const mockTemplateService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        { provide: TemplateService, useValue: mockTemplateService },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
    service = module.get<TemplateService>(TemplateService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a template', async () => {
      const createDto: CreateTemplateDto = {
        department: 'BME' as Departments,
        name: 'Test Template',
        is_default: false,
      };
      const result = { template_id: '1', ...createDto };
      mockTemplateService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toEqual(result);
      expect(mockTemplateService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of templates', async () => {
      const templates = [{ template_id: '1' }, { template_id: '2' }];
      mockTemplateService.findAll.mockResolvedValue(templates);

      expect(await controller.findAll()).toEqual(templates);
      expect(mockTemplateService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findByDepartment', () => {
    it('should return templates for a given department', async () => {
      const dept = 'ECE';
      const templates = [{ template_id: '3', department: dept }];
      mockTemplateService.findAll.mockResolvedValue(templates);

      expect(await controller.findByDepartment(dept)).toEqual(templates);
      expect(mockTemplateService.findAll).toHaveBeenCalledWith(dept);
    });
  });

  describe('findOne', () => {
    it('should return a single template', async () => {
      const template = { template_id: '1' };
      mockTemplateService.findOne.mockResolvedValue(template);

      expect(await controller.findOne('1')).toEqual(template);
      expect(mockTemplateService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if template not found', async () => {
      mockTemplateService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the template', async () => {
      const updateDto: UpdateTemplateDto = { name: 'Updated Name' };
      const template = { template_id: '1', name: 'Updated Name' };
      mockTemplateService.update.mockResolvedValue(template);

      expect(await controller.update('1', updateDto)).toEqual(template);
      expect(mockTemplateService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove the template', async () => {
      mockTemplateService.remove.mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      expect(mockTemplateService.remove).toHaveBeenCalledWith('1');
    });
  });
});
