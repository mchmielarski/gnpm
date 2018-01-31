import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrgMember } from '../entities';
import { Role } from '../enums';

@Component()
export class OrgMembersService {
  constructor(
    @InjectRepository(OrgMember) private readonly orgMembersRepository: Repository<OrgMember>
  ) {}

  findForOrg(orgName: string) {
    return this.orgMembersRepository.find({ where: { orgName }, relations: ['user'] });
  }

  getForOrg(userName: string, orgName: string) {
    return this.orgMembersRepository.findOne({ where: { orgName, userName } });
  }

  countForOrg(orgName: string) {
    return this.orgMembersRepository.count({ where: { orgName } });
  }

  deleteFromOrg(userName: string, orgName: string) {
    return this.orgMembersRepository.delete({ userName, orgName });
  }

  async createOrUpdate(userName: string, orgName: string, role: Role) {
    const currentMember = await this.getForOrg(userName, orgName);
    let member: OrgMember;

    if (currentMember) {
      member = this.orgMembersRepository.merge(currentMember, { role });
    } else {
      member = this.orgMembersRepository.create({
        user: { name: userName },
        org: { name: orgName },
        role
      });
    }

    return this.orgMembersRepository.save(member);
  }
}
