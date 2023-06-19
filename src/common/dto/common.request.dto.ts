import { IsEmail, IsNotEmpty } from 'class-validator';

export class CommonRequestUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
