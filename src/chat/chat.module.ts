import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpaceModule } from 'src/space/space.module';
import { PostModule } from 'src/post/post.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SpaceModule, PostModule, AuthModule],
  providers: [ChatService, ChatRepository, PrismaService],
  controllers: [ChatController],
  exports: [ChatService, ChatRepository],
})
export class ChatModule {}
