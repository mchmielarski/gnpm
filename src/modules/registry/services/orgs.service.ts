import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrgCreateOrUpdateDTO } from '../dto';
import { Org } from '../entities';

@Component()
export class OrgsService {
  constructor(@InjectRepository(Org) private readonly orgsRepository: Repository<Org>) {}

  get(name: string) {
    return this.orgsRepository.findOneById(name);
  }

  async exists(name: string) {
    return !!await this.get(name);
  }

  async save(data: OrgCreateOrUpdateDTO) {
    const currentOrg = await this.get(data.name);

    if (currentOrg) {
      return currentOrg;
    }
    const org = this.orgsRepository.create(data);
    return this.orgsRepository.save(org);
  }
}
