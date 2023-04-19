import { UserRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';
import { SpaceRepository } from 'src/space/space.repository';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}
  async makePost(spacename, body, user) {
    const isAdmin = await this.spaceRepository.isUserInSpaceWithAuth(
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
    const userId = await this.spaceRe
    const post = await this.postRepository.findPostById(
      postid,
      user.email,
      space.id,
    );
  }*/
}
