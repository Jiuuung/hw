import { UserRepository } from 'src/users/users.repository';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from './../users/users.module';
import { forwardRef, Module, Session } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenStrategy } from './jwt/refresh.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    PrismaService,
    RefreshTokenStrategy,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    UserRepository,
    PrismaService,
  ],
})
export class AuthModule {}
