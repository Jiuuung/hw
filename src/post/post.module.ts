import { PostRepository } from './post.repository';
import { SpaceModule } from './../space/space.module';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserRepository } from 'src/users/users.repository';
import { SpaceRepository } from 'src/space/space.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsersModule, SpaceModule],
  providers: [
    PostService,
    UserRepository,
    SpaceRepository,
    PostRepository,
    PrismaService,
  ],
  controllers: [PostController],
  exports: [PostService, PostRepository],
})
export class PostModule {}
