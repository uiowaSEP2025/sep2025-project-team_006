import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, ParseIntPipe, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from "./documents.service";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('/api/documents') // .*/api/documents/.*
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    // $ curl -X POST "http://localhost:5000/api/documents" -F "file=@app_1_redacted.pdf" -F "document_type=Transcript" -F "applicationId=1"
    @Post() // .*/api/documents
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads', // folder to save files
            filename: (req: any, file: { originalname: string; fieldname: any; }, callback: (arg0: null, arg1: string) => void) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { document_type: string; application_id: number },
    ) {
        // The file has been saved on disk, file.path contains the saved file's path.
        const newDocument = await this.documentsService.createDocument({
            document_type: body.document_type,
            file_path: file.path,
            application_id: Number(body.application_id),
        });
        return { success: true, newEntry: newDocument };
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
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=document_${id}.pdf`,
        });
        const fs = await import('fs');
        const stream = fs.createReadStream(document.file_path);
        stream.pipe(res);
    }
}
