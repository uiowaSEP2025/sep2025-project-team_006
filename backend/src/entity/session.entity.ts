import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('sessions') // table name in PostgreSQL
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  @Column()
  session_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  expires_at: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
