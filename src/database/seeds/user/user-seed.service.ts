import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../user/entities';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async run() {
    const hashedPassword = await bcryptjs.hash(
      this.configService.get<string>('ADMIN_PASSWORD'),
      +this.configService.get<number>('BCRYPT_ROUNDS'),
    );

    await this.userRepository.save({
      email: this.configService.get<string>('ADMIN_EMAIL'),
      password: hashedPassword,
      role_id: 1,
    });
  }
}
