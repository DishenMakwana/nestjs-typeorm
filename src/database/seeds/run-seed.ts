import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SeedModule } from './seed.module';
import { Logger } from '@nestjs/common';
import { UserSeedService } from './user/user-seed.service';
import { RoleSeedService } from './role/role-seed.service';

const runSeed = async () => {
  const logger: Logger = new Logger('Seeder');
  const app = await NestFactory.create<NestExpressApplication>(SeedModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });

  await app.get(RoleSeedService).run();
  logger.log('Role seed completed');

  await app.get(UserSeedService).run();
  logger.log('User seed completed');

  await app.close();
};

void runSeed();
