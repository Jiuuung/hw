import { PickType } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class MakeSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SpaceJoinBodyDto {
  @IsString()
  @IsNotEmpty()
  spacename: string;

  @IsString()
  @IsNotEmpty()
  access_code: string;

  @IsString()
  @IsNotEmpty()
  rolename: string;
}

export class SpaceUserRoleBodyDto extends PickType(SpaceJoinBodyDto, [
  'spacename',
  'rolename',
] as const) {}

export class SpaceMakeRoleBodyDto extends SpaceUserRoleBodyDto {
  @IsNotEmpty()
  auth: Auth;
}

export class SpaceDeleteRoleBodyDto extends SpaceMakeRoleBodyDto {}
