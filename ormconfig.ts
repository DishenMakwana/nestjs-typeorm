import * as dotenv from 'dotenv';
dotenv.config();

module.exports = {
  type: process.env.TYPEORM_CONNECTION as any,
  url: process.env.TYPEORM_URL,
  schema: process.env.TYPEORM_SCHEMA,
  seeds: [process.env.TYPEORM_SEEDS],
  factories: [process.env.TYPEORM_FACTORIES],
  ssl: process.env.TYPEORM_SSL === 'true',
};
