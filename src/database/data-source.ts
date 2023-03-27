import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { databaseConfig } from './config';

export const AppDataSource = new DataSource(
  databaseConfig as PostgresConnectionOptions & SeederOptions,
);
