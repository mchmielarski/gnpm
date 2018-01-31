import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from '../enums';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity({ name: 'team_members' })
export class TeamMember {
  @PrimaryGeneratedColumn() id: number;

  @Column() role: string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Team, team => team.members)
  team: Team;
}
