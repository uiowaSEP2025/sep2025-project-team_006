import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from './review.entity';
import { FacultyMetric } from './faculty_metric.entity';

@Entity('faculty')
export class Faculty {
  @PrimaryGeneratedColumn()
  faculty_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column()
  department: string;

  @Column()
  job_title: string;

  @OneToMany(() => Review, (review) => review.faculty)
  reviews: Review[];

  @OneToMany(() => FacultyMetric, (metric) => metric.faculty)
  faculty_metrics: FacultyMetric[];
}
