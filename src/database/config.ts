import * as dotenv from 'dotenv';
dotenv.config();
import { SeederOptions } from 'typeorm-extension';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

console.info('entities', __dirname + '/entities/*.entity{.ts,.js}');
console.info('migrations', __dirname + '/migrations/**/*{.ts,.js}');
console.info('seeders', __dirname + '/seeds/*{.ts,.js}');
console.info('factories', __dirname + '/factories/*{.ts,.js}');

export const databaseConfig: PostgresConnectionOptions & SeederOptions = {
  type: process.env.TYPEORM_CONNECTION as any,
  url: process.env.TYPEORM_URL,
  schema: process.env.TYPEORM_SCHEMA,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  seeds: [__dirname + '/seeds/*{.ts,.js}'],
  factories: [__dirname + '/factories/*{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  extra: {
    charset: 'utf8mb4_unicode_ci',
    max: parseInt(process.env.TYPEORM_MAX_CONNECTIONS) || 100,
  },
};
