import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryColumn() key: string;

  @Column() token: string;

  @Column({ default: false })
  readonly: boolean;

  @Column({ type: 'simple-array', nullable: true })
  cidrWhitelist: string[];

  @ManyToOne(type => User, user => user.tokens)
  user: User;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;
}
