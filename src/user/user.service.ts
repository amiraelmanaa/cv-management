
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Ancienne méthode :
  /*
  create(data: DeepPartial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
  */

  // Créer un utilisateur avec le rôle user par défaut
async create(data: DeepPartial<User>) {

  // Hacher le mot de passe avant de l'enregistrer
  const hashedPassword = await bcrypt.hash(data.password!, 10);

  const user = this.userRepository.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: 'user',
  });

  const savedUser = await this.userRepository.save(user);

  // Ne jamais renvoyer le mot de passe dans la réponse HTTP
  const { password, ...safeUser } = savedUser;
  return safeUser;
}

  // Ancienne méthode :
  /*
  findAll() {
    return this.userRepository.find({
      relations: { cvs: true },
    });
  }
  */

  // Récupérer tous les utilisateurs sans leurs mots de passe
  findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
      relations: {
        cvs: true,
      },
    });
  }

  // Ancienne méthode :
  /*
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { cvs: true },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }
  */

  // Récupérer un utilisateur par son ID
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
      relations: {
        cvs: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  // Ancienne méthode :
  /*
  async update(id: number, data: DeepPartial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }
  */

  // Modifier uniquement les champs autorisés
async update(id: number, data: DeepPartial<User>) {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException(`User ${id} not found`);
  }

  // On autorise uniquement ces trois modifications
  if (data.username !== undefined) {
    user.username = data.username;
  }

  if (data.email !== undefined) {
    user.email = data.email;
  }

  if (data.password !== undefined) {
    // Hacher le nouveau mot de passe
    user.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await this.userRepository.save(user);

  const { password, ...safeUser } = updatedUser;
  return safeUser;
}
  


  // Ancienne méthode :
  /*
  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
  */

  // Supprimer un utilisateur
  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    await this.userRepository.remove(user);

    return { message: `User ${id} deleted successfully` };
  }

  // Cette méthode est utilisée par AuthService pour vérifier l'email
  // Elle doit récupérer le password hashé pour permettre bcrypt.compare()
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
