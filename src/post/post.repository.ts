import { AdminPostDto } from './dto/post.admin.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UsersInSpaces } from '@prisma/client';
import { UserPostDto } from './dto/post.user.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async makeAdminPost(spacename: string, body: AdminPostDto, email: string) {
    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        author: { connect: { email: email } },
        space: { connect: { name: spacename } },
        isNotice: body.notice,
      },
    });
  }

  async makeUserPost(spacename: string, body: UserPostDto, email: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email: email, isDeleted: false },
    });
    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        author: { connect: { email: user.email } },
        space: { connect: { name: spacename } },
        isAnonymous: body.anonymous,
      },
    });
  }

  /*async findPostById(postid: number, email: string, spaceId: number){
    await this.prismaService.usersInSpaces.findFirstOrThrow({ where: { }})
    return await this.prismaService.
  }*/
}
