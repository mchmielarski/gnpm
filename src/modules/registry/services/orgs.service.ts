import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Org } from '../entities';

@Component()
export class OrgsService {
  constructor(@InjectRepository(Org) private readonly orgsRepository: Repository<Org>) {}

  get(name: string) {
    return this.orgsRepository.findOneById(name);
  }
}
