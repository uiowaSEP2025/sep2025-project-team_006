import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @Column()
  userID: number;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
