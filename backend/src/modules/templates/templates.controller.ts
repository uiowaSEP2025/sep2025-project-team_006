import { Controller } from '@nestjs/common';
import { TemplateService } from './templates.servive';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
}
