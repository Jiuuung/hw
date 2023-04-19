import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { SpaceRepository } from './space.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceRepository, PrismaService],
  exports: [SpaceService, SpaceRepository],
})
export class SpaceModule {}
