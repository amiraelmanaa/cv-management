
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/jwt-auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

//nous avons placé les trois décorateurs directement au niveau de la classe
//Parce que ces décorateurs s'appliquent à toutes les routes du contrôleur

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Ancienne méthode : création sans protection
  /*
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  */

  // Création d'un utilisateur : admin uniquement
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Ancienne méthode : liste accessible à tous
  /*
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  */

  // Afficher tous les utilisateurs : admin uniquement
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Ancienne méthode
  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  */

  // Afficher un utilisateur : admin uniquement
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // Ancienne méthode
  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  */

  // Modifier un utilisateur : admin uniquement
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  // Ancienne méthode
  /*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  */

  // Supprimer un utilisateur : admin uniquement
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
