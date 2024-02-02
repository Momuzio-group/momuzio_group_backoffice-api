import { Subscribe } from '@prisma/client';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetSubscribesSelections = {
  search?: string;
  pagination?: PaginationType;
  organizationId?: Subscribe['organizationId'];
};

export type GetOneSubscribesSelections = {
  organizationId?: Subscribe['organizationId'];
  subscribeId?: Subscribe['id'];
};

export type UpdateSubscribesSelections = {
  subscribeId?: Subscribe['id'];
};

export type CreateSubscribesOptions = Partial<Subscribe>;

export type UpdateSubscribesOptions = Partial<Subscribe>;
