import { OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class UserReturnDtoWithPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  refresh_token: string;

  imgUrl: string | null;
}

export class UserReturnDto extends OmitType(UserReturnDtoWithPasswordDto, [
  'password',
] as const) {}

export class UserCreateReturnDto extends PickType(UserReturnDto, [
  'email',
  'first_name',
  'last_name',
]) {}

export class UserDeleteInputDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class UserDeleteReturnDto extends PickType(UserReturnDto, [
  'email',
  'first_name',
  'last_name',
]) {}

export class UserRefreshTokenUpdateDto extends PickType(UserReturnDto, [
  'refresh_token',
]) {}
