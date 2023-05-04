import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AdminPostDto {
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

export class PostEditDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  isAnonymous: boolean;

  @IsBoolean()
  isNotice: boolean;
}
