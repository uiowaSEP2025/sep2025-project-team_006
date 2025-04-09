import { Test, TestingModule } from '@nestjs/testing';
import { Template } from 'src/entity/template.entity';
import { Repository, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from 'src/dto/create-template.dto';
import { UpdateTemplateDto } from 'src/dto/update-template.dto';
import { TemplateService } from 'src/modules/templates/templates.servive';
import { Departments } from 'src/modules/templates/departments.enum';
import { CreateTemplateMetricDto } from 'src/dto/create-template-metric.dto';
import { validate } from 'class-validator';

describe('TemplateService', () => {
    let service: TemplateService;
    let repository: Repository<Template>;

    // Create a mock repository with jest.fn() methods
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TemplateService,
                { provide: getRepositoryToken(Template), useValue: mockRepository },
            ],
        }).compile();

        service = module.get<TemplateService>(TemplateService);
        repository = module.get<Repository<Template>>(getRepositoryToken(Template));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('create', () => {
        it('should create and save a new template', async () => {
            const createDto: CreateTemplateDto = {
                department: Departments.BME,
                name: 'Biomedical Engineering Template',
                is_default: false,
            };

            const createdTemplate = { ...createDto, template_id: '123' } as Template;
            mockRepository.create.mockReturnValue(createdTemplate);
            mockRepository.save.mockResolvedValue(createdTemplate);

            const result = await service.create(createDto);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(createdTemplate);
            expect(result).toEqual(createdTemplate);
        });

        it('should pass validation with valid data', async () => {
            const dto = new CreateTemplateMetricDto();
            dto.metric_name = 'Test Metric';
            dto.metric_weight = '0.25';
            dto.description = 'Test description';

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('findAll', () => {
        it('should return all templates when no department is provided', async () => {
            const templates = [{ template_id: '1' }, { template_id: '2' }] as Template[];
            mockRepository.find.mockResolvedValue(templates);

            const result = await service.findAll();
            expect(mockRepository.find).toHaveBeenCalledWith();
            expect(result).toEqual(templates);
        });

        it('should return templates for a specific department when found', async () => {
            const dept = Departments.ECE;
            const templates = [{ template_id: '3', department: dept } as Template];
            mockRepository.find.mockResolvedValueOnce(templates);

            const result = await service.findAll(dept);
            expect(mockRepository.find).toHaveBeenCalledWith({ where: { department: dept } });
            expect(result).toEqual(templates);
        });

        it('should fallback to default templates when no template is found for the given department', async () => {
            const dept = Departments.ME;
            // First call returns empty array; second call returns default templates.
            mockRepository.find
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ template_id: 'default', is_default: true } as Template]);

            const result = await service.findAll(dept);
            expect(mockRepository.find).toHaveBeenNthCalledWith(1, { where: { department: dept } });
            expect(mockRepository.find).toHaveBeenNthCalledWith(2, { where: { is_default: true } });
            expect(result).toEqual([{ template_id: 'default', is_default: true } as Template]);
        });
    });

    describe('findOne', () => {
        it('should return a template when found', async () => {
            const template = { template_id: 'abc' } as Template;
            mockRepository.findOne.mockResolvedValue(template);

            const result = await service.findOne('abc');
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { template_id: 'abc' } });
            expect(result).toEqual(template);
        });

        it('should throw NotFoundException when template not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update and save a template', async () => {
            const existingTemplate = { template_id: '1', name: 'Old Name' } as Template;
            const updateDto: UpdateTemplateDto = { name: 'New Name' };
            const updatedTemplate = { template_id: '1', name: 'New Name' } as Template;

            mockRepository.findOne.mockResolvedValue(existingTemplate);
            // Simulate Object.assign modifying existingTemplate then save returns updated
            mockRepository.save.mockResolvedValue(updatedTemplate);

            const result = await service.update('1', updateDto);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { template_id: '1' } });
            expect(mockRepository.save).toHaveBeenCalledWith(existingTemplate);
            expect(result).toEqual(updatedTemplate);
        });
    });

    describe('remove', () => {
        it('should delete a template successfully', async () => {
            // Simulate delete result affected > 0
            const deleteResult: DeleteResult = { affected: 1, raw: [] };
            mockRepository.delete.mockResolvedValue(deleteResult);

            await service.remove('1');
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundException when delete affects 0 rows', async () => {
            // Simulate delete result affected = 0
            const deleteResult: DeleteResult = { affected: 0, raw: [] };
            mockRepository.delete.mockResolvedValue(deleteResult);
            await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });
});
