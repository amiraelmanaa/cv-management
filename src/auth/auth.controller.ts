import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Req() request: Request) {
  return {
    message: 'Vous êtes authentifié !',
    user: request.user,
  };
}

}