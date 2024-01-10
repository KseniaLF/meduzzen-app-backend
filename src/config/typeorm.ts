import { Logger } from '@nestjs/common';
import { CONNECTION } from './db.connection';

import { DataSource, DataSourceOptions } from 'typeorm';

const AppDataSource = new DataSource({
  ...(CONNECTION as DataSourceOptions),

  entities: ['*/**/*.entity.ts'],
  migrations: ['*/migrations/*.ts'],
  migrationsRun: true,
});

const logger = new Logger('Data Source');

AppDataSource.initialize()
  .then(() => {
    logger.log('Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
