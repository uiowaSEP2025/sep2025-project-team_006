import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/entity/document.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Application } from 'src/entity/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Application])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
