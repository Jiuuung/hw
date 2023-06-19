import { OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class UserReturnWithPasswordDTO {
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

export class UserReturnAuthorDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  imgUrl: string | null;
}
export class UserReturnDTO extends OmitType(UserReturnWithPasswordDTO, [
  'password',
] as const) {}

export class UserReturnFindDTO extends PickType(UserReturnDTO, [
  'first_name',
  'last_name',
  'imgUrl',
] as const) {}
export class UserReturnCreateDTO extends PickType(UserReturnDTO, [
  'email',
  'first_name',
  'last_name',
]) {}

export class UserReturnDeleteDTO extends PickType(UserReturnDTO, [
  'email',
  'first_name',
  'last_name',
]) {}
