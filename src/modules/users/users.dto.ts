import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from './../../app/utils/decorators/match.decorator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateLoginUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

export class CreateOrUpdateResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;
}

export class UpdateResetPasswordUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}

export class TokenUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  token: string;
}
