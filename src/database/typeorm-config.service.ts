import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { databaseConfig } from './config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...databaseConfig,
    } as TypeOrmModuleOptions;
    // return {
    //   type: this.configService.get<string>('TYPEORM_CONNECTION') as any,
    //   url: this.configService.get<string>('TYPEORM_URL'),
    //   schema: this.configService.get<string>('TYPEORM_SCHEMA'),
    //   entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    //   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    //   seeders: [__dirname + '/seeds/*{.ts,.js}'],
    //   factories: [__dirname + '/factories/*{.ts,.js}'],
    //   synchronize:
    //     this.configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
    //   logging: this.configService.get<string>('TYPEORM_LOGGING') === 'true',
    //   extra: {
    //     charset: 'utf8mb4_unicode_ci',
    //     max:
    //       parseInt(this.configService.get<string>('TYPEORM_MAX_CONNECTIONS')) ||
    //       100,
    //   },
    // } as TypeOrmModuleOptions;
  }
}
