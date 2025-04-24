import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  student_id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  // 🆕 Original GPA value (e.g., 8.5)
  @Column({ type: 'float', nullable: true })
  original_gpa: number;

  // 🆕 Scale type (e.g., '10', '100', '5')
  @Column({ type: 'varchar', length: 10, nullable: true })
  original_scale: string;

  // 🆕 Standardized GPA on a 4.0 scale
  @Column({ type: 'float', nullable: true })
  standardized_gpa: number | null;

  @OneToMany(() => Application, (application) => application.student)
  applications: Application[];
}
