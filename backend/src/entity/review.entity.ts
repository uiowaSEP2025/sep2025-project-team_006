import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Faculty } from './faculty.entity';
import { ReviewMetric } from './review_metric.entity';
import { Template } from './template.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column({ nullable: true })
  overall_score: number;

  @CreateDateColumn()
  review_date: Date;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ default: false })
  submitted: boolean;

  @Column({ default: false })
  liked: boolean;

  @ManyToOne(() => Application, (application) => application.reviews)
  application: Application;

  @ManyToOne(() => Faculty, (faculty) => faculty.reviews)
  faculty: Faculty;

  @OneToMany(() => ReviewMetric, (reviewMetric) => reviewMetric.review, {
    cascade: true,
  })
  review_metrics: ReviewMetric[];

  @ManyToOne(() => Template, { nullable: false })
  template: Template;
}
