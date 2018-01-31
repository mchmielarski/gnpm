import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  BeforeInsert,
  OneToMany
} from 'typeorm';
import { hash as hashPassword, compare as comparePassword } from 'bcrypt';
import { promisify } from 'util';

import { Token } from './token.entity';

const comparePasswordAsync = promisify(comparePassword);
const hashPasswordAsync = promisify(hashPassword);

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn() name: string;

  @Column({ length: 200 })
  email: string;

  @Column({ length: 200 })
  password: string;

  @OneToMany(type => Token, token => token.user)
  tokens: Token[];

  async comparePassword(plainPassword: string) {
    return comparePasswordAsync(plainPassword, this.password);
  }

  async hashPassword(plainPassword?: string) {
    this.password = await hashPasswordAsync(plainPassword || this.password, 10);
  }
}
