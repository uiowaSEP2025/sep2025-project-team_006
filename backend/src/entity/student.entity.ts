import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  student_id: number;

  @Column({ default: 'First' })
  first_name: string;

  @Column({ default: 'Name' })
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Application, (application) => application.student)
  applications: Application[];
}
