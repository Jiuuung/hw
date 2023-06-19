import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AuthRequestUserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthRequestUserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
