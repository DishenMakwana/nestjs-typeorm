import { Injectable } from '@nestjs/common';
import { UserTransformer } from './user.transformer';
import { AuthUserType } from '../common/types';
import * as bcryptjs from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userTransformer: UserTransformer,
  ) {}

  async changePassword(authUser: AuthUserType, password: string) {
    const user = await this.userRepository.update(
      { id: authUser.id },
      {
        password: await bcryptjs.hash(password, 10),
      },
    );

    return this.userTransformer.transform(user);
  }
}
