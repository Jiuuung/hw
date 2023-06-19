import { PickType } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ChatRequestMakeDTO {
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

export class ChatRequestListDTO extends PickType(ChatRequestMakeDTO, [
  'spacename',
  'postId',
] as const) {
  @IsNotEmpty()
  auth: Auth;
}

export class ChatRequestEditDTO extends ChatRequestMakeDTO {}

export class ChatRequestDeleteDTO extends ChatRequestMakeDTO {}
