import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Team } from '../entities';
import { Role } from '../enums';

@Component()
export class TeamsService {
  constructor(@InjectRepository(Team) private readonly teamsRepository: Repository<Team>) {}

  find(orgName: string) {
    return this.teamsRepository.find({ where: { orgName } });
  }

  get(orgName: string, name: string) {
    return this.teamsRepository.findOne({ where: { orgName, name } });
  }

  async save(orgName: string, name: string) {
    const currentTeam = await this.get(orgName, name);
    let team: Team;

    if (currentTeam) {
      team = this.teamsRepository.merge(currentTeam, { name });
    } else {
      team = this.teamsRepository.create({
        name,
        org: { name: orgName }
      });
    }

    return this.teamsRepository.save(team);
  }

  delete(orgName: string, name: string) {
    return this.teamsRepository.delete({ orgName, name });
  }
}
