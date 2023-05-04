import { IsEmail } from 'class-validator';
import { UserRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';
import { SpaceRepository } from 'src/space/space.repository';
import { PostRepository } from './post.repository';
import { Post, Auth } from '@prisma/client';
import {
  MakePostAdminReturnDto,
  MakePostUserReturnDto,
  PostAllReturnDto,
  PostAnonymousReturnDto,
  PostListReturn,
} from './dto/post.return.dto';
import { PostEditDto } from './dto/post.admin.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}
  async makeAdminPost(spacename, body, user): Promise<MakePostAdminReturnDto> {
    return await this.postRepository.makeAdminPost(spacename, body, user.email);
  }
  async makeUserPost(spacename, body, user): Promise<MakePostUserReturnDto> {
    return await this.postRepository.makeUserPost(spacename, body, user.email);
  }

  async seePost(
    spacename: string,
    postid: number,
    email: string,
    auth: Auth,
  ): Promise<PostAnonymousReturnDto | PostAllReturnDto | null> {
    const userId = await this.spaceRepository.getUserId(email);
    const post = await this.postRepository.findPostById(
      postid,
      userId.id,
      email,
      auth,
    );
    return post;
  }

  async listPost(
    spacename: string,
    auth: Auth,
    email: string,
  ): Promise<PostListReturn[]> {
    const userId = await this.spaceRepository.getUserId(email);
    if (auth === Auth.ADMIN) {
      return await this.postRepository.listPostAdmin(
        spacename,
        userId.id,
        email,
        auth,
      );
    }
    return await this.postRepository.listPostUser(
      spacename,
      userId.id,
      email,
      auth,
    );
  }
  async editPost(body: PostEditDto, id: number): Promise<PostAllReturnDto> {
    const post = await this.postRepository.editPost(
      body.title,
      body.content,
      body.isAnonymous,
      body.isNotice,
      id,
    );
    return post;
  }
  async deletePost(id: number): Promise<boolean> {
    await this.postRepository.deletePost(id);
    return true;
  }
}
