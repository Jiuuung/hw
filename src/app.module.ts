import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpaceModule } from './space/space.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, SpaceModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
