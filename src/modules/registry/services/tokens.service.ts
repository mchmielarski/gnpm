import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { v4 } from 'uuid';

import { Token } from '../entities';

@Component()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>
  ) {}

  async create(userId: number) {
    const token = v4();
    const key = this.createKeyForToken(token);
    const entity = this.tokensRepository.create({
      key,
      token,
      user: { id: userId }
    });
    return this.tokensRepository.save(entity);
  }

  findOne(where) {
    return this.tokensRepository.findOne({ where, relations: ['user'] });
  }

  findForUser(userId: number) {
    return this.tokensRepository.find({ where: { userId }});
  }

  delete(key: string) {
    return this.tokensRepository.deleteById(key);
  }

  createKeyForToken(token: string): string {
    const hash = createHash('sha512');
    hash.update(token);
    return hash.digest('hex');
  }
}
