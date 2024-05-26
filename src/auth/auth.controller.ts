import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() { emailOrUsername, password }: LoginDto, @Request() req) {
    const loginResponse = await this.authService.login(
      emailOrUsername,
      password,
    );
    console.log(emailOrUsername, password, loginResponse);
    if (loginResponse) {
      return {
        statusCode: 200,
        message: 'Bem-vindo(a), ' + loginResponse.firstname + '!',
        access_token: this.jwtService.sign(loginResponse),
      };
    }
    throw new HttpException('Credenciais inválidas', 401);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const jwt = req.headers.authorization.split(' ')[1];
    const meResponse = await this.authService.me(jwt);

    if (meResponse) {
      return {
        statusCode: 200,
        message: 'Bem-vindo(a), ' + meResponse.firstname + '!',
        user: meResponse,
      };
    } else {
      throw new HttpException('Usuário não encontrado', 404);
    }
  }
}
