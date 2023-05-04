import { IsBoolean, IsNumber, IsString, ValidateIf } from 'class-validator';
import { UserAuthorDto } from 'src/users/dto/users.return.dto';

export class Empty {
  @IsBoolean()
  anonymous: boolean;
}
export class ChatAllReturnDto {
  @IsString()
  content: string;

  author: UserAuthorDto | Empty;

  @IsNumber()
  order: number;

  @IsNumber()
  parentId: number;

  @IsNumber()
  rootId: number;

  @IsBoolean()
  isAnonymous: boolean;
}
