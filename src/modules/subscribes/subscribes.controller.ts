import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  PaginationType,
  addPagination,
} from '../../app/utils/pagination/with-pagination';
import { JwtAuthGuard } from '../users/middleware';
import { SubscribesService } from './subscribes.service';

@Controller('subscribes')
export class SubscribesController {
  constructor(private readonly subscribesService: SubscribesService) {}

  @Get(`/subscribers`)
  @UseGuards(JwtAuthGuard)
  async findFollowers(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const subscribers = await this.subscribesService.findAll({
      search,
      pagination,
    });

    return reply({ res, results: subscribers });
  }
}
