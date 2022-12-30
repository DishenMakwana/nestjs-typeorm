import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserSeedModule } from './user/user-seed.module';
import { RoleSeedModule } from './role/role-seed.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        './.env',
        './.env.dev',
        './.env.prod',
        './.env.stag',
        './.env.test',
      ],
    }),
    UserSeedModule,
    RoleSeedModule,
  ],
})
export class SeedModule {}
