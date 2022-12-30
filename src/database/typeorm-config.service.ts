import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('TYPEORM_CONNECTION') as any,
      url: this.configService.get('TYPEORM_URL'),
      schema: this.configService.get('TYPEORM_SCHEMA'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: this.configService.get('TYPEORM_SYNCHRONIZE') === 'true',
      logging: this.configService.get('TYPEORM_LOGGING') === 'true',
      extra: {
        charset: 'utf8mb4_unicode_ci',
        max: parseInt(this.configService.get('TYPEORM_MAX_CONNECTIONS')) || 100,
      },
    } as TypeOrmModuleOptions;
  }
}
