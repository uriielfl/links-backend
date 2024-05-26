import {
  DATA_SOURCE,
  PAGE_REPOSITORY,
} from '../../common/contants/repositories';
import { Page } from './entities/page.entity';

import { DataSource } from 'typeorm';

export const pageProviders = [
  {
    provide: PAGE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Page),
    inject: [DATA_SOURCE],
  },
];
