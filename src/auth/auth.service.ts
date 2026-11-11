import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {

    // 1 Vérifier si l'email existe déjà
    const existingUser = await this.userService.findByEmail(
      signupDto.email,
    );

    // 2 Refuser l'inscri si l'email existe
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // 3 Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      10,
    );

    // 4 Créer le new user
    const user = await this.userService.create({
      username: signupDto.username,
      email: signupDto.email,
      password: hashedPassword,
    });

    // 5 Ne pas retourner le mot de passe
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    //On retourne seuls les infos nécessaires
  }


/* ... 
  //Login
async login(loginDto: LoginDto) {

  //  1 Chercher l'utilisateur par email
  const user = await this.userService.findByEmail(
    loginDto.email,
  );

  // 2  Vérifier que l'utilisateur existe
  if (!user) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
    //HTTP 401 Unauthorized
  }

  // 3 Comparer le mot de passe avec le hash
  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    user.password,
  );

  // 4  Refuser si le mot de passe est incorrect
  if (!isPasswordValid) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  // 5  Retourner les informations de l'utilisateur
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

}
  */

async login(loginDto: LoginDto) {
  const user = await this.userService.findByEmail(loginDto.email);

  if (!user) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  // Générer le JWT
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const access_token = await this.jwtService.signAsync(payload);

  return {
    access_token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

}