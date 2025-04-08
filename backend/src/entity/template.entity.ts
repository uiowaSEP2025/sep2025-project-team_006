import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TemplateMetric } from './template_metric.entity';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn()
  template_id: string;

  // TODO: Use an enum
  @Column({ nullable: true })
  department: string;

  @Column()
  name: string;

  @Column({ default: false })
  is_default: boolean;

  @OneToMany(() => TemplateMetric, (metric) => metric.template, {
    cascade: true,
  })
  metrics: TemplateMetric[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
