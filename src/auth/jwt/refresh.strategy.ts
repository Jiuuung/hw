import { UserRepository } from './../../users/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import * as argon2 from 'argon2';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req): any => {
          return req?.cookies?.jwt;
        },
      ]),
      secretOrKey: jwtConstants.refresh_secret,
      passReqToCallback: true, //validate로 req보낼 수 있도록 하는 설정
    });
  }

  async validate(
    req: Request,
    payload?: {
      email: string;
      sub: number;
    },
  ): Promise<AuthUserInfo> {
    const refreshToken = req?.cookies?.jwt;
    const user = await this.userRepository.findUserWithoutPassword(payload.sub);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('user 없다. 또는 refresh token 없다.');
    } else {
      const isRefreshToken = await argon2.verify(
        user.refresh_token,
        refreshToken,
      );
      console.log('refresh-check' + isRefreshToken);
      if (isRefreshToken) {
        return { id: payload.sub, email: payload.email };
      } else {
        throw new UnauthorizedException('refresh token 매칭 안됨');
      }
    }
  }
}
