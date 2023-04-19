import { UserRepository } from '../../users/users.repository';
import { jwtConstants } from './../constants';
import {
  Injectable,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.access_secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload?: { email: string; sub: number }) {
    const user = await this.userRepository.findUserWithoutPassword(payload.sub);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('에러');
    }
  }
}
