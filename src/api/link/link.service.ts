import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Page } from '../page/entities/page.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { Link } from './entities/link.entity';

import { Repository } from 'typeorm';
import { normalizeDate } from 'src/common/helpers/normalizeData';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  async create(createLink: CreateLinkDto, creatorId: string) {
    const page = await this.pageRepository.findOne({
      where: { id: createLink.page, createdBy: +creatorId },
    });
    if (!page) {
      throw new Error('Página não encontrada');
    }
    const link = this.linkRepository.create(createLink);
    const newLink = await this.linkRepository.save(link);

    if (newLink) {
      return newLink;
    }
    throw new Error('Erro ao cadastrar link');
  }

  async delete(id: string, deleterId: string) {
    const link = await this.linkRepository
      .createQueryBuilder('link')
      .innerJoin('link.page', 'page')
      .where('link.id = :id', { id: +id })
      .andWhere('page.createdBy = :deleterId', { deleterId: +deleterId })
      .getOne();

    if (!link) {
      throw new HttpException(
        'Link não encontrado ou você não tem permissão para deletá-lo',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.linkRepository.delete(link.id);

    if (!response) {
      throw new HttpException('Erro ao deletar link', HttpStatus.BAD_REQUEST);
    }

    return response;
  }

  async findOne(id: string) {
    let link = await this.linkRepository.findOne({
      where: { id: +id },
      relations: ['page', 'linkClicks'],
    });
    if (link) {
      const normalizedClicks = link.linkClicks.map((linkClick) => ({...linkClick, clickedAt: normalizeDate(linkClick.clickedAt)}))
      const normalizedLink = {...link, linkClicks: normalizedClicks }
      return {link: normalizedLink };
    }

    throw new HttpException('Link  não encontrado', HttpStatus.NOT_FOUND);
  }
}
