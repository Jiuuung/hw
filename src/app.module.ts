import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpaceModule } from './space/space.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import config from 'config/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { dotEnvOptions } from 'dotenv-option';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    SpaceModule,
    PostModule,
    ConfigModule.forRoot({
      envFilePath: dotEnvOptions.path,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    if (process.env.NODE_ENV === 'dev') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
