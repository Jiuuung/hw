import { AdminPostDto } from './dto/post.admin.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UsersInSpaces, Role, Auth } from '@prisma/client';
import { UserPostDto } from './dto/post.user.dto';
import {
  MakePostAdminReturnDto,
  MakePostUserReturnDto,
} from './dto/post.return.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async makeAdminPost(
    spacename: string,
    body: AdminPostDto,
    email: string,
  ): Promise<MakePostAdminReturnDto> {
    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        author: { connect: { email: email } },
        space: { connect: { name: spacename } },
        isNotice: body.isnotice,
      },
      select: { title: true, author: true, space: true, isNotice: true },
    });
  }

  async makeUserPost(
    spacename: string,
    body: UserPostDto,
    email: string,
  ): Promise<MakePostUserReturnDto> {
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
      select: { title: true, author: true, space: true, isAnonymous: true },
    });
    return post;
  }

  /*async findPostById(
    postid: number,
    userId: number,
    email: string,
    spaceId: number,
  ) {
    const userinspace = await this.prismaService.usersInSpaces.findFirstOrThrow(
      {
        where: {
          userId: userId,
          spaceId: spaceId,
        },
        include: { user: true, role: true },
      },
    );
    const post = await this.prismaService.post.findUnique({
      where: { id: postid },
    });
    if (userinspace.role.auth === Auth.ADMIN || post.authoremail === email) {
      return null;
    }
    return null;
  }*/
}
