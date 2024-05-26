import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinkClick } from './entities/link-click.entity';
import { LinkClickController } from './link-click.controller';
import { LinkClickService } from './link-click.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinkClick])],
  providers: [LinkClickService],
  controllers: [LinkClickController],
})
export class LinkClickModule {}
