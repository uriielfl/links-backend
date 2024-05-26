import { Link } from 'src/api/link/entities/link.entity';
import { User } from 'src/api/users/entities/user.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pages' })
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @OneToMany(() => Link, (link) => link.page, { onDelete: 'CASCADE' })
  links: Link[];

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  createdBy: number;
}
