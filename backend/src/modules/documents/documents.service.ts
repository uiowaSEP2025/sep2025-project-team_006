import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from 'src/entity/document.entity';
import { Application } from 'src/entity/application.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepo: Repository<Document>,
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
  ) { }

  async createDocument(createDto: { document_type: string; file_path: string; applicationId: number }): Promise<Document> {
    const application = await this.applicationRepo.findOneBy({ application_id: createDto.applicationId });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    const document = this.documentRepo.create({
      document_type: createDto.document_type,
      file_path: createDto.file_path,
      application,
    });
    return await this.documentRepo.save(document);
  }

  async getDocumentById(id: number): Promise<Document> {
    const document = await this.documentRepo.findOne({
      where: { document_id: id },
    });
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return document;
  }
}
