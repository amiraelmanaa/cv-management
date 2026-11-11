
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

  // ==========================================
  // 1. CREATE
  // ==========================================

  /*
  ANCIEN CODE :

  create(data: DeepPartial<Cv>) {
    const cv = this.cvRepository.create(data);
    return this.cvRepository.save(cv);
  }
  */

  create(data: DeepPartial<Cv>, userId: number) {
    const cv = this.cvRepository.create({
      ...data,
      user: { id: userId },
    });

    return this.cvRepository.save(cv);
  }

  // ==========================================
  // 2. FIND ALL
  // ==========================================

  /*
  ANCIEN CODE :

  findAll() {
    return this.cvRepository.find({
      relations: {
        user: true,
        skills: true,
      },
    });
  }
  */

  findAll(userId: number) {
    return this.cvRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        skills: true,
      },
    });
  }

  // ==========================================
  // 3. FIND ONE
  // ==========================================

  /*
  ANCIEN CODE :

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
  */

  async findOne(id: number, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
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

  // ==========================================
  // 4. UPDATE
  // ==========================================

  /*
  ANCIEN CODE :

  async update(id: number, data: DeepPartial<Cv>) {
    const cv = await this.findOne(id);
    Object.assign(cv, data);
    return this.cvRepository.save(cv);
  }
  */

  async update(
    id: number,
    data: DeepPartial<Cv>,
    userId: number,
  ) {
    const cv = await this.findOne(id, userId);

    const safeData = { ...data };

    // Empêcher le client de changer le propriétaire ou l'ID
    delete safeData.user;
    delete safeData.id;

    Object.assign(cv, safeData);

    return this.cvRepository.save(cv);
  }

  // ==========================================
  // 5. REMOVE
  // ==========================================

  /*
  ANCIEN CODE :

  async remove(id: number) {
    const cv = await this.findOne(id);
    return this.cvRepository.remove(cv);
  }
  */

  async remove(id: number, userId: number) {
    const cv = await this.findOne(id, userId);

    return this.cvRepository.remove(cv);
  }
}
