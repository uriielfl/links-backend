import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/api/users/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(emailOrUsername: string, pass: string): Promise<any> {
    const isEmail = emailOrUsername?.includes('@');
    let user: User;

    if (!Boolean(emailOrUsername) || emailOrUsername?.length < 1) {
      throw new HttpException(
        { message: 'Usuário não encontrado', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (isEmail) {
      user = await this.userRepository.findOne({
        where: { email: emailOrUsername },
      });
    } else {
      user = await this.userRepository.findOne({
        where: { username: emailOrUsername },
      });
    }
    if (!user) {
      throw new HttpException(
        { message: 'Usuário não encontrado', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user) {
      const decryptedPassword = await bcrypt.compare(pass, user.password);
      if (decryptedPassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async me(jwt: string) {
    if (!jwt) return null;
    const decoded = this.jwtService.decode(jwt);
    const user = await this.userRepository.findOne({
      where: { id: decoded['id'] },
    });
    try {
      return user;
    } catch (e) {
      return null;
    }
  }
}
