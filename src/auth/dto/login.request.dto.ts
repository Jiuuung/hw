import { UserRequestDto } from './../../users/dto/users.request.dto';
import { PickType } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class LoginRequestDto extends PickType(UserRequestDto, [
  'email',
  'password',
] as const) {}
