import { Space, User } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class MakePostReturnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  author: User;

  space: Space;
}

export class MakePostUserReturnDto extends MakePostReturnDto {
  @IsBoolean()
  isAnonymous: boolean;
}

export class MakePostAdminReturnDto extends MakePostReturnDto {
  @IsBoolean()
  isNotice: boolean;
}
