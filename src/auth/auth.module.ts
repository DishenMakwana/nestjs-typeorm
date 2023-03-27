import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ATStrategy } from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code, User } from '../database/entities';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    TypeOrmModule.forFeature([User, Code]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ATStrategy],
})
export class AuthModule {}
