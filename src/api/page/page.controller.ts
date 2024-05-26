import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreatePageDto } from './dto/create-page.dto';
import { PageService } from './page.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('page')
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private jwtService: JwtService,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(@Body() createPageDto: CreatePageDto, @Req() req: any) {
    const jwt = req.headers.authorization.split(' ')[1];
    const id = this.jwtService.decode(jwt)['id'];
    return this.pageService.create(createPageDto, id);
  }

  @Get('my-pages')
  @UseGuards(JwtAuthGuard)
  findAllByCreator(@Req() req: any) {
    const jwt = req.headers.authorization.split(' ')[1];
    const id = this.jwtService.decode(jwt)['id'];
    return this.pageService.findAllByCreator(id);
  }

  @Get(':pathname')
  findOneByPathname(@Req() req: any, @Param('pathname') pathname: string) {
    const jwt = req.headers.authorization.split(' ')[1];
    const id = this.jwtService.decode(jwt)['id'];
    return this.pageService.findOneByPathname(pathname, id);
  }

  @Get(':pathname/:startDate/:endDate')
  @UseGuards(JwtAuthGuard)
  findOneByPathnameAndPeriod(
    @Param('pathname') pathname: string,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
    @Req() req: any,
  ) {
    const jwt = req.headers.authorization.split(' ')[1];
    const id = this.jwtService.decode(jwt)['id'];
    console.log(id)
    return this.pageService.findOneByPathnameAndPeriod(
      pathname,
      startDate,
      endDate,
      id,
    );
  }
}
