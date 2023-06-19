import { Auth } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class PostRequestUserDTO {
  @IsNotEmpty()
  auth: Auth;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateIf((o) => o.auth === Auth.ADMIN)
  @IsBoolean()
  @IsNotEmpty()
  isnotice: boolean;

  @ValidateIf((o) => o.auth === Auth.USER)
  @IsBoolean()
  @IsNotEmpty()
  anonymous: boolean;
}

export class PostRequestAdminDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isnotice: boolean;
}

export class PostRequestAdminEditDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  isAnonymous: boolean;

  @IsBoolean()
  isNotice: boolean;
}
