import { DataSource, DataSourceOptions } from 'typeorm';

let dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    break;
  case 'test':
    Object.assign(dataSourceOptions, {
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dataSourceOptions, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRuns: true,
      ssl: {
        rejectedUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('Unknown environment');
}
export { dataSourceOptions };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
