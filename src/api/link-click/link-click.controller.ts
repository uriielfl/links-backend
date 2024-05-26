import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateLinkClickDto } from './dto/create-link-click.dto';
import { LinkClickService } from './link-click.service';

@Controller('link-click')
export class LinkClickController {
  constructor(private readonly linkClickService: LinkClickService) {}
  @Post()
  create(@Body() createLinkClickDto: CreateLinkClickDto) {
    return this.linkClickService.create(createLinkClickDto);
  }

  @Get()
  findAll() {
    return this.linkClickService.findAll();
  }
}
