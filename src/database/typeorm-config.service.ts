import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { databaseConfig } from './config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...databaseConfig,
      cli: {
        entitiesDir: 'src/database/entities',
        migrationsDir: 'src/database/migrations',
        seedersDir: 'src/database/seeders',
      },
    } as TypeOrmModuleOptions;
  }
}
