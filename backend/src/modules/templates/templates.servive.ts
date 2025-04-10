import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from 'src/entity/template.entity';
import { Repository } from 'typeorm';
import { Departments } from './departments.enum';
import { UpdateTemplateDto } from 'src/dto/update-template.dto';
import { CreateTemplateDto } from 'src/dto/create-template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = this.templateRepository.create(createTemplateDto);
    return this.templateRepository.save(template);
  }

  async findAll(department?: string): Promise<Template[]> {
    if (department) {
      const dept = department as Departments;
      const templates = await this.templateRepository.find({
        where: { department: dept },
        relations: ['metrics'],
      });
      if (templates.length) {
        return templates;
      }
      // Fallback to default template if a specific department template isn't found.
      return this.templateRepository.find({
        where: { is_default: true },
        relations: ['metrics'],
      });
    }
    return this.templateRepository.find({
      relations: ['metrics'],
    });
  }

  async findOne(id: string): Promise<Template> {
    const template = await this.templateRepository.findOne({
      where: { template_id: id },
    });
    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
    return template;
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    const template = await this.findOne(id);
    Object.assign(template, updateTemplateDto);
    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const result = await this.templateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
  }
}
