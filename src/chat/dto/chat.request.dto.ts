import { PickType } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ChatMakeDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  isAnonymous: boolean;

  @IsString()
  @IsNotEmpty()
  spacename: string;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  chatId: number | null;
}

export class ChatListDto extends PickType(ChatMakeDto, [
  'spacename',
  'postId',
] as const) {
  @IsNotEmpty()
  auth: Auth;
}

export class ChatEditDto extends ChatMakeDto {}

export class ChatDeleteDto extends ChatMakeDto {}
