import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../../user/entities';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async run() {
    await this.roleRepository.delete({});

    await this.roleRepository.save([
      {
        id: 1,
        name: 'admin',
      },
      {
        id: 2,
        name: 'user',
      },
    ]);
  }
}
