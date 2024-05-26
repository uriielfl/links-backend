import { Link } from 'src/api/link/entities/link.entity';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'link-clicks' })
export class LinkClick {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Link, (link) => link.id)
  link: number;

  @Column()
  clickCount: number;

  @Column()
  clickedAt: Date;
}
