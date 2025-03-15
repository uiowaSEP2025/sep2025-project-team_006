import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Application } from './application.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  document_id: number;

  @Column()
  document_type: string;

  @Column()
  file_path: string;

  @CreateDateColumn()
  uploaded_at: Date;

  @ManyToOne(() => Application, (application) => application.documents)
  application: Application;
}
