import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { UserReturnAuthorDTO } from 'src/users/dto/users.return.dto';

export class ChatReturnEmptyDTO {
  @IsBoolean()
  anonymous: boolean;
}
export class ChatReturnDTO {
  @IsString()
  content: string;

  author: UserReturnAuthorDTO | ChatReturnEmptyDTO;

  @IsNumber()
  order: number;

  @IsNumber()
  parentId: number;

  @IsNumber()
  rootId: number;

  @IsBoolean()
  isAnonymous: boolean;
}
