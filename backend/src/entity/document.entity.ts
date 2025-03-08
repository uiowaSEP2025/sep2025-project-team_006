import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Application } from './application.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  document_id: number;

  @Column()
  document_type: string; // Transcript, SOP, etc.

  @Column()
  file_path: string; // Not sure on this yet, will research how to store uploaded files

  @Column()
  uploaded_at: Date;

  @ManyToOne(() => Application, (application) => application.documents)
  application: Application;
}
