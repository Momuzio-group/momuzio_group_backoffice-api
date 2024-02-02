import { Injectable } from '@nestjs/common';
import { Membership, Prisma } from '@prisma/client';
import { DatabaseService } from '../../app/database/database.service';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateMembershipsOptions,
  GetMembershipsSelections,
  GetOneMembershipsSelections,
  UpdateMembershipsOptions,
  UpdateMembershipsSelections,
} from './memberships.type';

@Injectable()
export class MembershipsService {
  constructor(private readonly client: DatabaseService) {}

  async findAll(
    selections: GetMembershipsSelections,
  ): Promise<WithPaginationResponse | null> {
    const prismaWhere = {} as Prisma.MembershipWhereInput;
    const { pagination, organizationId } = selections;

    if (organizationId) {
      Object.assign(prismaWhere, { organizationId });
    }

    const memberships = await this.client.membership.findMany({
      where: { ...prismaWhere, deletedAt: null },
      skip: pagination.skip,
      take: pagination.take,
      orderBy: pagination.orderBy,
    });

    const rowCount = await this.client.membership.count({
      where: { ...prismaWhere, deletedAt: null },
    });

    return withPagination({
      pagination,
      rowCount,
      value: memberships,
    });
  }

  /** Find one Memberships to the database. */
  async findOneBy(selections: GetOneMembershipsSelections) {
    const prismaWhereMembership = {} as Prisma.MembershipWhereInput;
    const { membershipId, organizationId } = selections;

    if (membershipId) {
      Object.assign(prismaWhereMembership, { id: membershipId });
    }

    if (organizationId) {
      Object.assign(prismaWhereMembership, { organizationId });
    }

    const Membership = await this.client.membership.findFirst({
      where: { ...prismaWhereMembership, deletedAt: null },
    });

    return Membership;
  }

  /** Create one Memberships to the database. */
  async createOne(options: CreateMembershipsOptions): Promise<Membership> {
    const {
      title,
      price,
      month,
      status,
      description,
      messageWelcome,
      organizationId,
    } = options;

    const Membership = this.client.membership.create({
      data: {
        title,
        price,
        month,
        status,
        description,
        messageWelcome,
        organizationId,
      },
    });

    return Membership;
  }

  /** Update one Memberships to the database. */
  async updateOne(
    selections: UpdateMembershipsSelections,
    options: UpdateMembershipsOptions,
  ): Promise<Membership> {
    const { membershipId } = selections;
    const {
      title,
      price,
      month,
      status,
      description,
      messageWelcome,
      organizationId,
      deletedAt,
    } = options;

    const Membership = this.client.membership.update({
      where: {
        id: membershipId,
      },
      data: {
        title,
        price,
        month,
        status,
        description,
        messageWelcome,
        organizationId,
        deletedAt,
      },
    });

    return Membership;
  }
}
