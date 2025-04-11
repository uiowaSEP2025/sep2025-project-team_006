import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TemplateMetric } from './template_metric.entity';
import { Departments } from 'src/modules/templates/departments.enum';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn()
  template_id: string;

  @Column({
    type: 'enum',
    enum: Departments,
    default: Departments.NONE,
  })
  department: Departments;

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
