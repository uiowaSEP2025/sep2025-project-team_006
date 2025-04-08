import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Template } from './template.entity';

@Entity('template_metrics')
export class TemplateMetric {
  @PrimaryGeneratedColumn()
  template_metric_id: string;

  @Column()
  metric_name: string;

  @Column({ default: "" })
  description: string;

  @Column()
  metric_weight: string;

  @ManyToOne(() => Template, template => template.metrics, { onDelete: 'CASCADE' })
  template: Template;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
