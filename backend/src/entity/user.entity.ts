import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Faculty } from './faculty.entity';
import { Student } from './student.entity';
import { Session } from './session.entity';

// Note: we can set multiple roles here if we want.
// https://typeorm.io/entities#enum-column-type
export enum AccountType {
  FACULTY = 'faculty',
  STUDENT = 'student',
}

@Entity('users') // table name in PostgreSQL
@Check(
  `("student_id" IS NOT NULL AND "faculty_id" IS NULL) OR ("student_id" IS NULL AND "faculty_id" IS NOT NULL)`,
) // This is needed to ensure only one account type can be added.
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.STUDENT,
  })
  account_type: AccountType;

  // If the account is for a student:
  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  // If the account is for a faculty:
  @ManyToOne(() => Faculty, { nullable: true })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @Column()
  provider: string; // 'Google' or 'Microsoft'

  @Column()
  provider_id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  registered_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
