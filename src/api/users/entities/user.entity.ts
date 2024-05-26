import { Page } from 'src/api/page/entities/page.entity';

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  firstname: string;

  @Column()
  @IsNotEmpty()
  lastname: string;

  @Column()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @OneToMany(() => Page, (page) => page.createdBy, { onDelete: 'CASCADE' })
  links: Page[];
}
