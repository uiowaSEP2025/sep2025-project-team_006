import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('review_metrics')
export class ReviewMetric {
  @PrimaryGeneratedColumn()
  review_metric_id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // Weight selected during review (can differ from facultyMetric.defaultWeight)
  @Column('float')
  selected_weight: number;

  @Column('float')
  value: number;

  @Column('float') // TBD how we will do this score
  calculated_score: number;

  @ManyToOne(() => Review, (review) => review.review_metrics)
  review: Review;
}
