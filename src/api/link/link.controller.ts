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

import { CreateLinkDto } from './dto/create-link.dto';
import { LinkService } from './link.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('links')
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
    private jwtService: JwtService,
  ) {}
  @Post()
  create(@Body() createPageDto: CreateLinkDto, @Req() req: any) {
    const jwt = req.headers.authorization.split(' ')[1];
    const creatorId = this.jwtService.decode(jwt)['id'];
    return this.linkService.create(createPageDto, creatorId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    const jwt = req.headers.authorization.split(' ')[1];
    const creatorId = this.jwtService.decode(jwt)['id'];
    return this.linkService.delete(id, creatorId);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.linkService.findOne(id);
  }
}
