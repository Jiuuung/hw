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
  notice: boolean;
}
