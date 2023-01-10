import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION as any,
  url: process.env.TYPEORM_URL,
  schema: process.env.TYPEORM_SCHEMA,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  seeders: [process.env.TYPEORM_SEEDING_SEEDS],
  factories: [process.env.TYPEORM_SEEDING_FACTORIES],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  extra: {
    charset: 'utf8mb4_unicode_ci',
    max: parseInt(process.env.TYPEORM_MAX_CONNECTIONS) || 100,
  },
} as DataSourceOptions);
