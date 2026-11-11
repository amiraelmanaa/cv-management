
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Cv } from './entities/cv.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
  ) {}

  create(data: DeepPartial<Cv>) {
    const cv = this.cvRepository.create(data);
    return this.cvRepository.save(cv);
  }

  findAll() {
    return this.cvRepository.find({
      relations: {
  user: true,
  skills: true,
},
    });
  }

  async findOne(id: number) {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: {
  user: true,
  skills: true,
},
    });

    if (!cv) {
      throw new NotFoundException(`CV ${id} not found`);
    }

    return cv;
  }

  async update(id: number, data: DeepPartial<Cv>) {
    const cv = await this.findOne(id);
    Object.assign(cv, data);
    return this.cvRepository.save(cv);
  }

  async remove(id: number) {
    const cv = await this.findOne(id);
    return this.cvRepository.remove(cv);
  }
}
