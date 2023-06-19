import { UserRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';
import { SpaceRepository } from 'src/space/space.repository';
import { PostRepository } from './post.repository';
import { Auth } from '@prisma/client';
import {
  PostReturnAdminMakeDTO,
  PostReturnUserMakeDTO,
  PostReturnDTO,
  PostReturnAnonymousDTO,
  PostReturnListDTO,
} from './dto/post.return.dto';
import { PostRequestAdminEditDTO } from './dto/post.request.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}
  async makeAdminPost(spacename, body, user): Promise<PostReturnAdminMakeDTO> {
    return await this.postRepository.makeAdminPost(spacename, body, user.email);
  }
  async makeUserPost(spacename, body, user): Promise<PostReturnUserMakeDTO> {
    return await this.postRepository.makeUserPost(spacename, body, user.email);
  }

  async seePost(
    postid: number,
    email: string,
    auth: Auth,
  ): Promise<PostReturnAnonymousDTO | PostReturnDTO | null> {
    const post = await this.postRepository.findPostById(postid, email, auth);
    return post;
  }

  async listPost(
    spacename: string,
    auth: Auth,
    email: string,
  ): Promise<PostReturnListDTO[]> {
    if (auth === Auth.ADMIN) {
      return await this.postRepository.listPostAdmin(spacename);
    }
    return await this.postRepository.listPostUser(spacename, email);
  }
  async editPost(
    role: Auth,
    body: PostRequestAdminEditDTO,
    id: number,
  ): Promise<PostReturnDTO> {
    const post = await this.postRepository.editPost(
      body.title,
      body.content,
      role === Auth.ADMIN ? false : body.isAnonymous,
      role === Auth.ADMIN ? body.isNotice : false,
      id,
    );
    return post;
  }
  async deletePost(id: number): Promise<boolean> {
    await this.postRepository.deletePost(id);
    return true;
  }
}
