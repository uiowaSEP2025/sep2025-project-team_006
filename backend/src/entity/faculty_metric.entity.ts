import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Faculty } from './faculty.entity';

@Entity('faculty_metrics')
export class FacultyMetric {
  @PrimaryGeneratedColumn()
  faculty_metric_id: number;

  @Column()
  metric_name: string; // e.g., "GPA"

  @Column()
  description: string; // e.g., "M.I.T"

  @Column('float')
  default_weight: number; // e.g., 3.2

  @ManyToOne(() => Faculty, (faculty) => faculty.faculty_metrics)
  faculty: Faculty;
}
