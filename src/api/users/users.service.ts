import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Erro ao criar usuário', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await this.userRepository.save(user);
    delete newUser.password;
    if (newUser) {
      return newUser;
    }
    throw new HttpException('Erro ao criar usuário', HttpStatus.BAD_REQUEST);
  }

  async findAll() {
    const users = await this.userRepository.find();
    if (users) {
      return users.map((user) => {
        delete user.password;
        return user;
      });
    }
    throw new Error('No users found');
  }

  async findOne(id: number) {
    let user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      delete user.password;
      return { user };
    }
    throw new HttpException('Usuário não encontrado', 404);
  }

  async findOneByEmailOrUsername(emailOrUsername: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (user) {
      return user;
    }
    throw new HttpException('Usuário não encontrado', 404);
  }
}
