import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DocumentsController } from 'src/modules/documents/documents.controller';
import { DocumentsService } from 'src/modules/documents/documents.service';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { DocumentType } from 'src/modules/documents/document-type.enum';
import { Response } from 'express';
import * as fs from 'fs';

describe('DocumentsController', () => {
    let controller: DocumentsController;
    let service: DocumentsService;

    // Fake document to simulate a returned document from the service
    const fakeDocument = {
        document_id: 1,
        file_path: 'uploads/sample.pdf',
        document_type: DocumentType.PDF,
    };

    // A helper function to create a fake Express Response object
    const mockResponse = (): Response => {
        const res: Partial<Response> = {
            set: jest.fn(),
        };
        return res as Response;
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentsController],
            providers: [
                {
                    provide: DocumentsService,
                    useValue: {
                        createDocument: jest.fn().mockResolvedValue(fakeDocument),
                        getDocumentById: jest.fn().mockResolvedValue(fakeDocument),
                    },
                },
            ],
        }).compile();

        controller = module.get<DocumentsController>(DocumentsController);
        service = module.get<DocumentsService>(DocumentsService);
    });

    describe('uploadDocument', () => {
        it('should upload a document and return the new document', async () => {
            const fakeFile = {
                path: 'uploads/sample.pdf',
                originalname: 'sample.pdf',
                fieldname: 'file',
            } as Express.Multer.File;
            const createDto: CreateDocumentDto = {
                document_type: DocumentType.PDF,
                file_path: '', // value is not used since file.path is used instead
                application_id: 1,
            };

            const result = await controller.uploadDocument(fakeFile, createDto);
            expect(service.createDocument).toHaveBeenCalledWith({
                document_type: createDto.document_type,
                file_path: fakeFile.path,
                application_id: 1,
            });
            expect(result).toEqual(fakeDocument);
        });
    });

    describe('getDocument', () => {
        let res: Response;

        beforeEach(() => {
            res = mockResponse();
            // Spy on fs.createReadStream to simulate a file stream with a pipe method.
            jest.spyOn(fs, 'createReadStream').mockReturnValue({
                pipe: jest.fn(),
            } as any);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should get a document and pipe the file to response (PDF)', async () => {
            const id = 1;
            await controller.getDocument(id, res);
            expect(service.getDocumentById).toHaveBeenCalledWith(id);
            // Default content type for PDF
            expect(res.set).toHaveBeenCalledWith({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename=document_${id}.${DocumentType.PDF}`,
            });
            expect(fs.createReadStream).toHaveBeenCalledWith(fakeDocument.file_path);
        });

        it('should set correct content type for XLSX documents', async () => {
            const xlsxDocument = { ...fakeDocument, document_type: DocumentType.XLSX };
            (service.getDocumentById as jest.Mock).mockResolvedValue(xlsxDocument);
            await controller.getDocument(1, res);
            expect(res.set).toHaveBeenCalledWith({
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `inline; filename=document_1.${DocumentType.XLSX}`,
            });
        });

        it('should throw NotFoundException when document is not found', async () => {
            (service.getDocumentById as jest.Mock).mockResolvedValue(null);
            await expect(controller.getDocument(999, res)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw NotFoundException when document file_path is missing', async () => {
            (service.getDocumentById as jest.Mock).mockResolvedValue({
                ...fakeDocument,
                file_path: null,
            });
            await expect(controller.getDocument(1, res)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
