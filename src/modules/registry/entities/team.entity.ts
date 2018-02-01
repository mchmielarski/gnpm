import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { TeamMember } from './team-member.entity';
import { Org } from './org.entity';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @ManyToOne(type => Org, org => org.teams)
  org: Org;

  @OneToMany(type => TeamMember, member => member.team)
  members: Team[];

  readonly orgName;
}
