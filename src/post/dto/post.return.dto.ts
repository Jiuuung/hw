import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UserReturnAuthorDTO } from 'src/users/dto/users.return.dto';

export class PostReturnMakeDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  author: UserReturnAuthorDTO;

  space: { name: string };
}

export class PostReturnUserMakeDTO extends PostReturnMakeDTO {
  @IsBoolean()
  isAnonymous: boolean;
}

export class PostReturnAdminMakeDTO extends PostReturnMakeDTO {
  @IsBoolean()
  isNotice: boolean;
}

export class PostReturnAnonymousDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  fileurl: string;

  @IsBoolean()
  isAnonymous: boolean;
}

export class PostReturnDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  author: UserReturnAuthorDTO;

  @IsString()
  fileurl: string;

  @IsBoolean()
  isNotice: boolean;

  @IsBoolean()
  isAnonymous: boolean;
}
export class PostReturnEmptyDTO {
  @IsBoolean()
  anonymous: boolean;
}
export class PostReturnListDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  author: UserReturnAuthorDTO | PostReturnEmptyDTO;

  @IsBoolean()
  isNotice: boolean;

  @IsBoolean()
  isAnonymous: boolean;
}
