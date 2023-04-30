import { Auth } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class PostDto {
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
