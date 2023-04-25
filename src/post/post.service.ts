import { IsEmail } from 'class-validator';
import { UserRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';
import { SpaceRepository } from 'src/space/space.repository';
import { PostRepository } from './post.repository';
import { Post } from '@prisma/client';
import {
  MakePostAdminReturnDto,
  MakePostUserReturnDto,
} from './dto/post.return.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}
  async makePost(
    spacename,
    body,
    user,
  ): Promise<MakePostUserReturnDto | MakePostAdminReturnDto> {
    const isAdmin = await this.spaceRepository.GetAdminUserInSpace(
      user.email,
      spacename,
    );
    if (isAdmin) {
      return await this.postRepository.makeAdminPost(
        spacename,
        body,
        user.email,
      );
    } else {
      return await this.postRepository.makeUserPost(
        spacename,
        body,
        user.email,
      );
    }
  }

  /*async seePost(spacename: string, postid: number, user) {
    const space = await this.spaceRepository.findSpaceByName(spacename);
    const userId = await this.spaceRepository.getUserId(user.IsEmail);
    const post = await this.postRepository.findPostById(
      postid,
      userId.id,
      user.email,
      space.id,
    );
  }*/
}
