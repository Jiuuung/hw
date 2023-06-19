import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth } from '@prisma/client';
import {
  PostRequestAdminDTO,
  PostRequestUserDTO,
} from './dto/post.request.dto';
import {
  PostReturnAdminMakeDTO,
  PostReturnUserMakeDTO,
  PostReturnDTO,
  PostReturnAnonymousDTO,
  PostReturnListDTO,
} from './dto/post.return.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async makeAdminPost(
    spacename: string,
    body: PostRequestAdminDTO,
    email: string,
  ): Promise<PostReturnAdminMakeDTO> {
    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        author: { connect: { email: email } },
        space: { connect: { name: spacename } },
        isNotice: body.isnotice,
      },
      select: {
        title: true,
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        space: { select: { name: true } },
        isNotice: true,
      },
    });
  }

  async makeUserPost(
    spacename: string,
    body: PostRequestUserDTO,
    email: string,
  ): Promise<PostReturnUserMakeDTO> {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email: email },
    });
    const post = await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        author: { connect: { email: user.email } },
        space: { connect: { name: spacename } },
        isAnonymous: body.anonymous,
      },
      select: {
        title: true,
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        space: { select: { name: true } },
        isAnonymous: true,
      },
    });
    return post;
  }

  async findPostById(
    postid: number,
    email: string,
    auth: Auth,
  ): Promise<PostReturnAnonymousDTO | PostReturnDTO | null> {
    const post = await this.prismaService.post.findFirst({
      where: { id: postid, isDeleted: false },
      select: {
        title: true,
        content: true,
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        fileurl: true,
        isAnonymous: true,
        isNotice: true,
      },
    });
    if (
      auth === Auth.ADMIN ||
      post.author.email === email ||
      post.isAnonymous === true
    ) {
      return post;
    }
    const { author, ...anonypost } = post;
    return anonypost;
  }
  async isPostExist(postid: number, spacename: string): Promise<boolean> {
    const post = await this.prismaService.post.findFirst({
      where: { id: postid, spacename: spacename, isDeleted: false },
      select: { id: true },
    });
    if (post) {
      return true;
    }
    return false;
  }
  async isPostAuthor(postid: number, email: string): Promise<boolean> {
    const isAuthor = await this.prismaService.post.findFirst({
      where: { id: postid, authoremail: email, isDeleted: false },
      select: { authoremail: true },
    });
    if (isAuthor) {
      return true;
    } else {
      return false;
    }
  }

  async listPostAdmin(spacename: string): Promise<PostReturnListDTO[]> {
    const postList = await this.prismaService.post.findMany({
      where: {
        spacename: spacename,
        isDeleted: false,
      },
      select: {
        title: true,
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        isAnonymous: true,
        isNotice: true,
      },
    });
    return postList;
  }
  async listPostUser(
    spacename: string,
    email: string,
  ): Promise<PostReturnListDTO[]> {
    const postListNotAnon = await this.prismaService.post.findMany({
      where: {
        spacename: spacename,
        isDeleted: false,
        OR: [{ isAnonymous: false }, { authoremail: email }],
      },
      select: {
        title: true,
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        isAnonymous: true,
        isNotice: true,
      },
    });
    const postListAnon = await this.prismaService.post.findMany({
      where: {
        spacename: spacename,
        isDeleted: false,
        isAnonymous: true,
        NOT: { authoremail: email },
      },
      select: {
        title: true,
        author: {
          select: {
            anonymous: true,
          },
        },
        isAnonymous: true,
        isNotice: true,
      },
    });
    const postList = [...postListNotAnon, ...postListAnon];
    return postList;
  }

  async editPost(
    title: string,
    content: string,
    isAnonymous: boolean,
    isNotice: boolean,
    id: number,
  ): Promise<PostReturnDTO> {
    const post = await this.prismaService.post.update({
      where: { id: id },
      data: {
        title: title,
        content: content,
        isAnonymous: isAnonymous,
        isNotice: isNotice,
      },
      select: {
        title: true,
        content: true,
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        fileurl: true,
        isAnonymous: true,
        isNotice: true,
      },
    });
    return post;
  }
  async deletePost(id: number): Promise<boolean> {
    await this.prismaService.post.update({
      where: { id: id },
      data: { isDeleted: true },
    });
    return true;
  }
}
