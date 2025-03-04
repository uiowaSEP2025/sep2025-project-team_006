import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  student_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string; // TODO: verify if this should be needed since it is already in the User table

  @Column()
  phone_number: string;

  @Column()
  address: string;

  // Note: we will add other personal details as needed

  @OneToMany(() => Application, (application) => application.student)
  applications: Application[];
}
