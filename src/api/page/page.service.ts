import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePageDto } from './dto/create-page.dto';
import { Page } from './entities/page.entity';

import { Repository } from 'typeorm';

export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  async create(createPageDto: CreatePageDto, id: string) {
    const alreadyExists = await this.pageRepository.findOne({ where: { path: createPageDto.path } });
    if (alreadyExists) {
      throw new HttpException('Uma página com esse path já existe', HttpStatus.BAD_REQUEST);
    }
    const page = this.pageRepository.create({
      ...createPageDto,
      createdBy: +id,
    });

    const newPage = await this.pageRepository.save(page);
    if (newPage) {
      return newPage;
    }
    throw new HttpException('Erro ao criar página', HttpStatus.BAD_REQUEST);
  }


  async findAllByCreator(id: string) {
    const pages = await this.pageRepository.find({
      relations: ['links', 'links.linkClicks'],
      where: { createdBy: +id },
    });
    if (pages) {
      return pages;
    }
    throw new HttpException('Páginas não encontradas', HttpStatus.NOT_FOUND);
  }

  async findOneByPathname(pathname: string, id: string) {
    let page = await this.pageRepository.findOne({
      where: { path: pathname, createdBy: +id },
      relations: ['links', 'links.linkClicks'],
    });
    if (page) {
      return { page };
    }
    throw new HttpException('Página não encontrada', HttpStatus.NOT_FOUND);
  }

  async findOneByPathnameAndPeriod(
    pathname: string,
    startDate: Date,
    endDate: Date,
    creatorId: string,
  ) {

    const page = await this.pageRepository
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.links', 'link')
      .leftJoinAndSelect(
        'link.linkClicks',
        'linkClick',
        'linkClick.clickedAt BETWEEN :start AND :end',
      )
      .where('page.path = :pathname', { pathname })
      .where('page.createdBy = :creatorId', { creatorId: Number(creatorId) })
      .orderBy('linkClick.clickCount', 'DESC')
      .limit(5)
      .setParameter('start', startDate)
      .setParameter('end', endDate)
      .getOne();

    const pageData = await this.pageRepository.findOne({
      where: { path: pathname, createdBy: +creatorId},
      relations: ['links', 'links.linkClicks'],
    });

    if (page) {
      let pageWithTotalClicks;
      pageWithTotalClicks = page;
      pageWithTotalClicks.links = page.links
        .map((link) => {
          const totalClicks = link.linkClicks
            .map((linkClick) => {
              return linkClick.clickCount;
            })
            .reduce((a, b) => a + b, 0);

          return { ...link, totalClicks };
        })
        .filter((link) => link.totalClicks !== 0);

        const p =  pageData.links.map((link) => (
          {...link, totalClicks: link.linkClicks.map((linkClick) => linkClick.clickCount).reduce((a, b) => a + b, 0)}
        ))
        pageData.links = p;
        const dashboard = {
          dash: pageWithTotalClicks,
          page: pageData
        }
      return dashboard;
    }
    throw new HttpException('Página não encontrada', HttpStatus.NOT_FOUND);
  }
}
