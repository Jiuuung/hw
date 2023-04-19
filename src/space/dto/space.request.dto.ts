import { IsNotEmpty, IsString } from 'class-validator';

export class MakeSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
