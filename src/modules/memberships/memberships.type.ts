import { Membership } from '@prisma/client';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetMembershipsSelections = {
  search?: string;
  pagination?: PaginationType;
  organizationId?: Membership['organizationId'];
};

export type GetOneMembershipsSelections = {
  organizationId?: Membership['organizationId'];
  membershipId?: Membership['id'];
};

export type UpdateMembershipsSelections = {
  membershipId?: Membership['id'];
};

export type CreateMembershipsOptions = Partial<Membership>;

export type UpdateMembershipsOptions = Partial<Membership>;
