import { Type } from 'class-transformer';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOrUpdateMembershipsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  price?: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  month?: number;

  // @IsNotEmpty()
  // @IsString()
  // @IsIn(currencyCodeArrays)
  // currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  messageWelcome: string;
}

export class GetMembershipDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;
}
