import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { _ } from '../../common';
import { UserCreateDTO, UserLoginOrCreateDTO } from '../dto';
import { User } from '../entities';

@Component()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(dto: UserCreateDTO) {
    const user = this.usersRepository.create(dto);
    await user.hashPassword();
    return this.usersRepository.save(user);
  }

  async get(name: string) {
    return this.usersRepository.findOne({ where: { name }});
  }

  isUserCreateDTO(dto: UserLoginOrCreateDTO): dto is UserCreateDTO {
    return dto.email !== undefined;
  }

  isUserEntity(obj: any): obj is User {
    return obj instanceof User;
  }
}
