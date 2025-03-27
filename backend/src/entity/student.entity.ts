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

  @OneToMany(() => Application, (application) => application.student)
  applications: Application[];
}
