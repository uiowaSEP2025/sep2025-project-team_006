import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { DocumentType } from 'src/modules/documents/document-type.enum';

export class CreateDocumentDto {
  @IsEnum(DocumentType, {
    message: 'document_type must be either "pdf" or "xlsx"',
  })
  document_type: DocumentType;

  @IsString()
  @IsNotEmpty()
  file_path: string;

  @IsNumber()
  application_id: number;
}
