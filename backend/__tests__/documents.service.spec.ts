import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from 'src/entity/document.entity';
import { Application } from 'src/entity/application.entity';
import { NotFoundException } from '@nestjs/common';
import { DocumentsService } from 'src/modules/documents/documents.service';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { DocumentType } from 'src/modules/documents/document-type.enum';

describe('DocumentsService', () => {
    let service: DocumentsService;
    let documentRepo: any;
    let applicationRepo: any;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DocumentsService,
          {
            provide: getRepositoryToken(Document),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOneBy: jest.fn(),
              findOne: jest.fn(),
            },
          },
          {
            provide: getRepositoryToken(Application),
            useValue: {
              findOneBy: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<DocumentsService>(DocumentsService);
      documentRepo = module.get(getRepositoryToken(Document));
      applicationRepo = module.get(getRepositoryToken(Application));
    });
  
    describe('createDocument', () => {
      it('should throw NotFoundException if application is not found', async () => {
        const createDto: CreateDocumentDto = {
          document_type: DocumentType.PDF,
          file_path: 'uploads/sample.pdf',
          application_id: 1,
        };
        applicationRepo.findOneBy.mockResolvedValue(null);
  
        await expect(service.createDocument(createDto)).rejects.toThrow(NotFoundException);
        expect(applicationRepo.findOneBy).toHaveBeenCalledWith({ application_id: 1 });
      });
  
      it('should create and save a new document', async () => {
        const createDto: CreateDocumentDto = {
          document_type: DocumentType.PDF,
          file_path: 'uploads/sample.pdf',
          application_id: 1,
        };
  
        const fakeApplication = { application_id: 1 } as Application;
        applicationRepo.findOneBy.mockResolvedValue(fakeApplication);
  
        const createdDoc = { document_id: 42, ...createDto, application: fakeApplication };
        documentRepo.create.mockReturnValue(createdDoc);
        documentRepo.save.mockResolvedValue(createdDoc);
  
        const result = await service.createDocument(createDto);
        expect(result).toEqual(createdDoc);
        expect(documentRepo.create).toHaveBeenCalledWith({
          document_type: createDto.document_type,
          file_path: createDto.file_path,
          application: fakeApplication,
        });
        expect(documentRepo.save).toHaveBeenCalledWith(createdDoc);
      });
    });
  
    describe('getDocumentById', () => {
        it('should throw NotFoundException if document not found', async () => {
          // Use findOne since the service calls findOne
          documentRepo.findOne.mockResolvedValue(null);
          await expect(service.getDocumentById(999)).rejects.toThrow(NotFoundException);
          expect(documentRepo.findOne).toHaveBeenCalledWith({ where: { document_id: 999 } });
        });
      
        it('should return the document if found', async () => {
          const fakeDocument = { document_id: 2, file_path: 'uploads/sample.pdf', document_type: DocumentType.PDF };
          documentRepo.findOne.mockResolvedValue(fakeDocument);
      
          const result = await service.getDocumentById(2);
          expect(result).toEqual(fakeDocument);
          expect(documentRepo.findOne).toHaveBeenCalledWith({ where: { document_id: 2 } });
        });
      });
  });
