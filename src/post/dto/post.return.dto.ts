import { Space, User } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserAuthorDto } from 'src/users/dto/users.return.dto';

export class MakePostReturnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  author: UserAuthorDto;

  space: { name: string };
}

export class MakePostUserReturnDto extends MakePostReturnDto {
  @IsBoolean()
  isAnonymous: boolean;
}

export class MakePostAdminReturnDto extends MakePostReturnDto {
  @IsBoolean()
  isNotice: boolean;
}

export class PostAnonymousReturnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  fileurl: string;

  @IsBoolean()
  isAnonymous: boolean;
}

export class PostAllReturnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  author: UserAuthorDto;

  @IsString()
  fileurl: string;

  @IsBoolean()
  isNotice: boolean;

  @IsBoolean()
  isAnonymous: boolean;
}
export class Empty {
  @IsBoolean()
  anonymous: boolean;
}
export class PostListReturn {
  @IsString()
  @IsNotEmpty()
  title: string;

  author: UserAuthorDto | Empty;

  @IsBoolean()
  isNotice: boolean;

  @IsBoolean()
  isAnonymous: boolean;
}
