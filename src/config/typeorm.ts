import { CONNECTION } from './db.connection';

import { DataSource, DataSourceOptions } from 'typeorm';

const AppDataSource = new DataSource({
  ...(CONNECTION as DataSourceOptions),

  entities: ['*/**/*.entity.ts'],
  migrations: ['*/migrations/*.ts'],
  migrationsRun: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
