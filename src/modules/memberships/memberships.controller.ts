import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from './../../app/utils/search-query/search-query.dto';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  PaginationType,
  addPagination,
} from '../../app/utils/pagination/with-pagination';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdateMembershipsDto,
  GetMembershipDto,
} from './memberships.dto';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GetMembershipDto,
    @Query() requestPaginationDto: RequestPaginationDto,
  ) {
    const { organizationId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const memberships = await this.membershipsService.findAll({
      search,
      organizationId,
      pagination,
    });

    return reply({ res, results: memberships });
  }

  /** Post one Memberships */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateOrUpdateMembershipsDto,
  ) {
    const { user } = req;
    const { title, description, messageWelcome, price, month } = body;

    const membership = await this.membershipsService.createOne({
      title,
      description,
      messageWelcome,
      price: Number(price),
      month: Number(month),
      organizationId: user?.organizationId,
    });

    return reply({ res, results: membership });
  }

  /** Post one Memberships */
  @Put(`/:membershipId`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateMembershipsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { title, description, messageWelcome, price, month } = body;
    const { user } = req;

    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
      organizationId: user?.organizationId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.membershipsService.updateOne(
      { membershipId },
      {
        title,
        description,
        messageWelcome,
        price: Number(price),
        month: Number(month),
      },
    );

    return reply({ res, results: 'membership updated successfully' });
  }

  /** Get one Memberships */
  @Get(`/show/:membershipId`)
  @UseGuards(UserAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Req() req,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { user } = req;
    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
      organizationId: user.organizationId,
    });

    return reply({ res, results: findOneMembership });
  }

  /** Delete one Memberships */
  @Delete(`/delete/:membershipId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { user } = req;
    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
      organizationId: user?.organizationId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const Membership = await this.membershipsService.updateOne(
      { membershipId: findOneMembership?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: Membership });
  }
}
