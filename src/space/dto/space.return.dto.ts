import { PickType } from '@nestjs/swagger';
import { Auth, UsersInSpaces } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SpaceReturnDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  users: UsersInSpaces[];
}

export class SpaceReturnJoinDTO {
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

export class SpaceReturnCreateDTO {
  @IsNotEmpty()
  @IsString()
  access_code_manager: string;

  @IsNotEmpty()
  @IsString()
  access_code_participation: string;
}

export class SpaceReturnIdDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  spaceId: number;
}

export class SpaceReturnAdminDTO extends PickType(SpaceReturnJoinDTO, [
  'spaceId',
  'roleId',
] as const) {}

export class SpaceReturnMkOrChangeRoleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  spacename: string;

  auth: Auth;
}
