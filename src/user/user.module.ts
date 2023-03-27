import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { UserTransformer } from './user.transformer';
import { Code } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Code])],
  providers: [UserService, UserTransformer],
  controllers: [UserController],
  exports: [UserTransformer],
})
export class UserModule {}
