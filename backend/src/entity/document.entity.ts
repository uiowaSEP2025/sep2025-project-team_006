import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { DocumentType } from 'src/modules/documents/document-type.enum';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  document_id: number;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  document_type: DocumentType; // Only "pdf" or "xlsx" will be allowed

  @Column()
  file_path: string;

  @CreateDateColumn()
  uploaded_at: Date;

  @ManyToOne(() => Application, (application) => application.documents)
  application: Application;
}
