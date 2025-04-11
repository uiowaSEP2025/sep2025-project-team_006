import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Review } from './review.entity';

@Entity('review_metrics')
export class ReviewMetric {
  @PrimaryGeneratedColumn()
  review_metric_id: number;

  @Column({ nullable: true })
  name: string;

  @Column('float')
  selected_weight: number;

  @Column('float')
  template_weight: number;

  @Column('float')
  value: number;

  @ManyToOne(() => Review, (review) => review.review_metrics)
  review: Review;
}
