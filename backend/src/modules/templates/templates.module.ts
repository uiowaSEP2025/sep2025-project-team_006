import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from 'src/entity/template.entity';
import { TemplateMetric } from 'src/entity/template_metric.entity';
import { TemplateService } from './templates.servive';
import { TemplateController } from './templates.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Template, TemplateMetric]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
