import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User, Session])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
