import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Page } from '../page/entities/page.entity';
import { Link } from './entities/link.entity';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Page])],
  providers: [LinkService, JwtService],
  controllers: [LinkController],
})
export class LinkModule {}
