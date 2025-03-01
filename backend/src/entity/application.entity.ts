import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Review } from './review.entity';
import { Document } from './document.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  application_id: number;

  @Column()
  status: string;

  @CreateDateColumn()
  submission_date: Date;

  @Column()
  department: string;

  @Column()
  degree_program: string;

  // Note: we may other application details, it will depend on how the application process will take place for the student

  @ManyToOne(() => Student, (student) => student.applications)
  student: Student;

  @OneToMany(() => Document, (document) => document.application)
  documents: Document[];

  @OneToMany(() => Review, (review) => review.application)
  reviews: Review[];
}
