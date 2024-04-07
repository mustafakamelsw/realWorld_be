import { DataSource } from 'typeorm';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mustafa',
  password: 'Aa123123',
  database: 'test',
  entities: ['src/entities/*.ts'],
  synchronize: true,
});
