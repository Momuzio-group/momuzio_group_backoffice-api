import { Injectable } from '@nestjs/common';
import { Prisma, Subscribe } from '@prisma/client';
import { DatabaseService } from '../../app/database/database.service';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateSubscribesOptions,
  GetOneSubscribesSelections,
  GetSubscribesSelections,
  UpdateSubscribesOptions,
  UpdateSubscribesSelections,
} from './subscribes.type';

@Injectable()
export class SubscribesService {
  constructor(private readonly client: DatabaseService) {}

  async findAll(
    selections: GetSubscribesSelections,
  ): Promise<WithPaginationResponse | null> {
    const prismaWhere = {} as Prisma.SubscribeWhereInput;
    const { pagination, organizationId } = selections;

    if (organizationId) {
      Object.assign(prismaWhere, { organizationId });
    }

    const Subscribes = await this.client.subscribe.findMany({
      where: { ...prismaWhere, deletedAt: null },
      skip: pagination.skip,
      take: pagination.take,
      orderBy: pagination.orderBy,
    });

    const rowCount = await this.client.subscribe.count({
      where: { ...prismaWhere, deletedAt: null },
    });

    return withPagination({
      pagination,
      rowCount,
      value: Subscribes,
    });
  }

  /** Find one Subscribes to the database. */
  async findOneBy(selections: GetOneSubscribesSelections) {
    const prismaWhereSubscribe = {} as Prisma.SubscribeWhereInput;
    const { subscribeId, organizationId } = selections;

    if (subscribeId) {
      Object.assign(prismaWhereSubscribe, { id: subscribeId });
    }

    if (organizationId) {
      Object.assign(prismaWhereSubscribe, { organizationId });
    }

    const Subscribe = await this.client.subscribe.findFirst({
      where: { ...prismaWhereSubscribe, deletedAt: null },
    });

    return Subscribe;
  }

  /** Create one Subscribes to the database. */
  async createOne(options: CreateSubscribesOptions): Promise<Subscribe> {
    const { expiredAt, subscriberId, userId, membershipId, organizationId } =
      options;

    const subscribe = this.client.subscribe.create({
      data: {
        expiredAt,
        subscriberId,
        userId,
        membershipId,
        organizationId,
      },
    });

    return subscribe;
  }

  /** Update one Subscribes to the database. */
  async updateOne(
    selections: UpdateSubscribesSelections,
    options: UpdateSubscribesOptions,
  ): Promise<Subscribe> {
    const { subscribeId } = selections;
    const {
      expiredAt,
      subscriberId,
      userId,
      membershipId,
      organizationId,
      deletedAt,
    } = options;

    const subscribe = this.client.subscribe.update({
      where: {
        id: subscribeId,
      },
      data: {
        expiredAt,
        subscriberId,
        userId,
        membershipId,
        organizationId,
        deletedAt,
      },
    });

    return subscribe;
  }
}
