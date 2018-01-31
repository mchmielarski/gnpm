import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { OrgMember } from './org-member.entity';
import { Team } from './team.entity';

@Entity({ name: 'orgs' })
export class Org {
  @PrimaryColumn() name: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @OneToMany(type => Team, team => team.org)
  teams: Team[];

  @OneToMany(type => OrgMember, member => member.org)
  members: OrgMember[];
}
