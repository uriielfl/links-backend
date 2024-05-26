import {
  DATA_SOURCE,
  PAGE_REPOSITORY,
} from '../../common/contants/repositories';
import { Link } from './entities/link.entity';

import { DataSource } from 'typeorm';

export const linkProviders = [
  {
    provide: PAGE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Link),
    inject: [DATA_SOURCE],
  },
];
