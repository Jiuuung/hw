import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthReturnTokensDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class AuthReturnUserInfoDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  email: string;
}
