
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  // ==========================================
  // 1. CREATE
  // ==========================================

  /*
  ANCIEN CODE :
  
  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }
  */

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCvDto: CreateCvDto,
    @Req() request: any,
  ) {
    return this.cvService.create(
      createCvDto,
      request.user.id,
    );
  }

  // ==========================================
  // 2. FIND ALL
  // ==========================================

  /*
  ANCIEN CODE :

  @Get()
  findAll() {
    return this.cvService.findAll();
  }
  */

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request: any) {
    return this.cvService.findAll(request.user.id);
  }

  // ==========================================
  // 3. FIND ONE
  // ==========================================

  /*
  ANCIEN CODE :

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }
  */

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @Req() request: any,
  ) {
    return this.cvService.findOne(
      +id,
      request.user.id,
    );
  }

  // ==========================================
  // 4. UPDATE
  // ==========================================

  /*
  ANCIEN CODE :

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
  ) {
    return this.cvService.update(+id, updateCvDto);
  }
  */

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @Req() request: any,
  ) {
    return this.cvService.update(
      +id,
      updateCvDto,
      request.user.id,
    );
  }

  // ==========================================
  // 5. REMOVE
  // ==========================================

  /*
  ANCIEN CODE :

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.remove(+id);
  }
  */

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @Req() request: any,
  ) {
    return this.cvService.remove(
      +id,
      request.user.id,
    );
  }
}
