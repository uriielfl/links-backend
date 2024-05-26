import { LinkClick } from 'src/api/link-click/entities/link-click.entity';
import { Page } from 'src/api/page/entities/page.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'link' })
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Page, (page) => page.id)
  page: number;

  @Column()
  url: string;

  @OneToMany(() => LinkClick, (linkClick) => linkClick.link, {
    onDelete: 'CASCADE',
  })
  linkClicks: LinkClick[];
}
