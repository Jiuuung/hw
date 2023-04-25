import { UserRequestDto } from './../../users/dto/users.request.dto';
import { PickType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';

export class LoginRequestDto extends PickType(UserRequestDto, [
  'email',
  'password',
] as const) {}

export class GetTokenReturnDto {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;
}
