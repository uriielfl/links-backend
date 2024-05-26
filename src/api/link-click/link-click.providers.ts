import {
  DATA_SOURCE,
  LINK_CLICK_REPOSITORY,
} from '../../common/contants/repositories';
import { LinkClick } from './entities/link-click.entity';

import { DataSource } from 'typeorm';

export const linkClickProviders = [
  {
    provide: LINK_CLICK_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LinkClick),
    inject: [DATA_SOURCE],
  },
];
