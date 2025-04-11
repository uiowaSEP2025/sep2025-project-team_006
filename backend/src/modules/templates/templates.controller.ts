import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TemplateService } from './templates.servive';
import { CreateTemplateDto } from 'src/dto/create-template.dto';
import { UpdateTemplateDto } from 'src/dto/update-template.dto';

@Controller('api/templates') // .*/api/templates/.*
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post() // .*/api/templates
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get() // .*/api/templates
  async findAll() {
    return this.templateService.findAll();
  }

  @Get('department/:department') // .*/api/templates/department/:department
  async findByDepartment(@Param('department') department: string) {
    return this.templateService.findAll(department);
  }

  @Get(':id') // .*/api/templates/:id
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Put(':id') // .*/api/templates/:id
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id') // .*/api/templates/:id
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
