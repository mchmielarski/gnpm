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

  find(orgName: string) {
    return this.orgMembersRepository.find({ where: { orgName }, relations: ['user'] });
  }

  get(orgName: string, userName: string) {
    return this.orgMembersRepository.findOne({ where: { orgName, userName } });
  }

  isOwner(orgName: string, userName: string) {
    return this.hasRole(orgName, userName, Role.OWNER);
  }

  isAdmin(orgName: string, userName: string) {
    return this.hasRole(orgName, userName, Role.ADMIN);
  }

  isDeveloper(orgName: string, userName: string) {
    return this.hasRole(orgName, userName, Role.DEVELOPER);
  }

  async isMember(orgName: string, userName: string) {
    return !!await this.get(orgName, userName);
  }

  count(orgName: string) {
    return this.orgMembersRepository.count({ where: { orgName } });
  }

  delete(orgName: string, userName: string) {
    return this.orgMembersRepository.delete({ userName, orgName });
  }

  async save(orgName: string, userName: string, role: Role) {
    const currentMember = await this.get(orgName, userName);
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

  private async hasRole(orgName: string, userName: string, role: Role) {
    const member = await this.get(orgName, userName);
    return !!(member && member.role === role);
  }
}
