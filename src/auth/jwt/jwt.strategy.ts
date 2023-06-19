import { AuthReturnUserInfoDTO } from './../dto/login.return.dto';
import { UserRepository } from '../../users/users.repository';
import { jwtConstants } from './../constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.access_secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload?: {
    email: string;
    sub: number;
  }): Promise<AuthReturnUserInfoDTO> {
    const user: AuthReturnUserInfoDTO =
      await this.userRepository.findUserWithoutPassword(payload.sub);
    if (user) {
      console.log(user);
      return user;
    } else {
      throw new UnauthorizedException('JWT no user error');
    }
  }
}
