import { PickType } from '@nestjs/swagger';
import { Auth, User, UsersInSpaces } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IdReturnDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class SpaceReturnDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  users: UsersInSpaces[];
}

export class SpaceCodeManagerReturnDto {
  @IsNotEmpty()
  @IsString()
  access_code_manager: string;
}

export class SpaceJoinReturnDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  spaceId: number;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}

export class SpaceCreateReturnDto {
  @IsNotEmpty()
  @IsString()
  access_code_manager: string;

  @IsNotEmpty()
  @IsString()
  access_code_participation: string;
}

export class SpacePassIdDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  spaceId: number;
}

export class SpaceAdminUserReturnDto extends PickType(SpaceJoinReturnDto, [
  'spaceId',
  'roleId',
] as const) {}

export class MkOrChangeRoleReturnDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  spacename: string;

  auth: Auth;
}
