import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  document_type: string;

  @IsString()
  @IsNotEmpty()
  file_path: string;

  @IsNumber()
  application_id: number;
}
