import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  REVIEWER = 'reviewer',
  USER = 'user',
}

@Entity('users') // table name in PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({
    unique: true,
  })
  email: string;

  // look into using a transformer for this column.
  @Column()
  passwordDigest: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  // note: can set multiple roles here if we want.
  // https://typeorm.io/entities#set-column-type

  @Column()
  oauth: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
