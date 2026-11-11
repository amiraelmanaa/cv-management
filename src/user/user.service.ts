
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(data: DeepPartial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      relations: {
  cvs: true,
},
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
  cvs: true,
},
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async update(id: number, data: DeepPartial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
