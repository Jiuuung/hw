import { PickType } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SpaceRequestChangeRoleDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  role: string;
}
export class SpaceRequestMakeDTO {
  @IsString()
  @IsNotEmpty()
  spacename: string;

  @IsArray()
  @IsNotEmpty()
  manager_role: string[];

  @IsArray()
  user_role: string[];

  @IsString()
  @IsNotEmpty()
  my_role: string;
}

export class SpaceRequestJoinDTO {
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

export class SpaceRequestUserRoleDTO extends PickType(SpaceRequestJoinDTO, [
  'spacename',
  'rolename',
] as const) {}

export class SpaceRequestMakeRoleDTO extends SpaceRequestUserRoleDTO {
  @IsNotEmpty()
  auth: Auth;
}

export class SpaceRequestDeleteRoleDTO extends SpaceRequestUserRoleDTO {}
