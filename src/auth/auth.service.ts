import { jwtConstants } from './constants';
import { IsEmail } from 'class-validator';
import { UserRepository } from '../users/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetTokenReturnDto, LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Payload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto): Promise<any> {
    const { email, password } = data;
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('이메일을 확인하세요.');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호를 확인하세요.');
    }

    const payload = { email, sub: user.id };
    const tokens = await this.getTokens(payload, user.id);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(
    id: number,
    refresh_token: string,
  ): Promise<boolean> {
    return await this.userRepository.updateRefreshToken(id, refresh_token);
  }

  async logout(userId: number): Promise<boolean> {
    return await this.userRepository.logout(userId);
  }

  async getTokens(payload: Payload, id: number): Promise<GetTokenReturnDto> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.access_secret,
        expiresIn: '1y',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refresh_secret,
        expiresIn: '30d',
      }),
    ]);
    return { access_token, refresh_token };
  }

  async refreshToken(id: number, refresh_token: string): Promise<string> {
    const user = await this.userRepository.findUserWithoutPassword(id);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('user 없다. 또는 refresh token 없다.');
    } else {
      const isRefreshToken = await argon2.verify(
        user.refresh_token,
        refresh_token,
      );
      if (isRefreshToken) {
        const payload = { email: user.email, sub: id };
        const tokens = await this.jwtService.signAsync(payload, {
          secret: jwtConstants.access_secret,
          expiresIn: '1h',
        });
        return tokens;
      } else {
        throw new UnauthorizedException('refresh token 매칭 안됨');
      }
    }
  }
}
