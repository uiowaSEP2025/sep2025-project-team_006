import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { DocumentType } from './document-type.enum';
import * as fs from 'fs';

@Controller('/api/documents') // .*/api/documents/.*
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post() // .*/api/documents
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // local folder to store files, in .gitignore
        filename: (
          _,
          file: { originalname: string; fieldname: any },
          callback: (arg0: null, arg1: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
  ) {
    const new_document = await this.documentsService.createDocument({
      document_type: body.document_type,
      file_path: file.path,
      application_id: Number(body.application_id),
    });
    return new_document;
  }

  @Get(':id') // .*/api/documents/:id
  async getDocument(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const document = await this.documentsService.getDocumentById(id);
    if (!document || !document.file_path) {
      throw new NotFoundException('Document not found');
    }

    let contentType = 'application/pdf';
    if (document.document_type === DocumentType.XLSX) {
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename=document_${id}.${document.document_type}`,
    });
    const stream = fs.createReadStream(document.file_path);
    stream.pipe(res);
  }
}
