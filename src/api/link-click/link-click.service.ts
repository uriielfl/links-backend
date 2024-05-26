import { InjectRepository } from '@nestjs/typeorm';

import { CreateLinkClickDto } from './dto/create-link-click.dto';
import { LinkClick } from './entities/link-click.entity';

import { Repository } from 'typeorm';

export class LinkClickService {
  constructor(
    @InjectRepository(LinkClick)
    private linkClickRepository: Repository<LinkClick>,
  ) {}

  async create(createLinkClick: CreateLinkClickDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const linkClickByPeriod = await this.linkClickRepository.findOne({
      where: { clickedAt: new Date(today), link: createLinkClick.link },
    });
    if (linkClickByPeriod) {
      linkClickByPeriod.clickCount += 1;
      const updatedLinkClick =
        await this.linkClickRepository.save(linkClickByPeriod);
      if (updatedLinkClick) {
        return updatedLinkClick;
      }
    }

    const page = this.linkClickRepository.create({
      ...createLinkClick,
      clickedAt: today,
      clickCount: 1,
    });
    const newPage = await this.linkClickRepository.save(page);

    if (newPage) {
      return newPage;
    }
    throw new Error('Erro ao criar página');
  }

  async findAll() {
    const linkClick = await this.linkClickRepository.find();
    if (linkClick) {
      return linkClick;
    }
    throw new Error('No link clicks found');
  }
}
