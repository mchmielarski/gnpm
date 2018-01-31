import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from '../enums';
import { User } from './user.entity';
import { Org } from './org.entity';

@Entity({ name: 'org_members' })
export class OrgMember {
  @PrimaryGeneratedColumn() id: number;

  @Column() role: string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Org, org => org.members)
  org: Org;

  readonly userName: string;
  readonly orgName: string;
}
