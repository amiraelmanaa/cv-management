import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvModule } from './cv/cv.module';
import { SkillModule } from './skill/skill.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      autoLoadEntities: true,
      synchronize: true,
    }),

    CvModule,

    SkillModule,

    UserModule,

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
