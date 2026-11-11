
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  create(data: DeepPartial<Skill>) {
    const skill = this.skillRepository.create(data);
    return this.skillRepository.save(skill);
  }

  findAll() {
    return this.skillRepository.find({
      relations: {
  cvs: true,
},
    });
  }

  async findOne(id: number) {
    const skill = await this.skillRepository.findOne({
      where: { id },
    relations: {
  cvs: true,
},
    });

    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`);
    }

    return skill;
  }

  async update(id: number, data: DeepPartial<Skill>) {
    const skill = await this.findOne(id);
    Object.assign(skill, data);
    return this.skillRepository.save(skill);
  }

  async remove(id: number) {
    const skill = await this.findOne(id);
    return this.skillRepository.remove(skill);
  }
}
