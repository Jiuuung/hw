import { jwtConstants } from './constants';
import { UserRepository } from '../users/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequestUserLoginDTO } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './jwt/jwt.payload';
import { AuthReturnTokensDTO } from './dto/login.return.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: AuthRequestUserLoginDTO): Promise<AuthReturnTokensDTO> {
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
    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken(payload);
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
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

  async getAccessToken(payload: Payload): Promise<string> {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.access_secret,
      expiresIn: '1h',
    });
    return access_token;
  }

  async getRefreshToken(payload: Payload): Promise<string> {
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refresh_secret,
      expiresIn: '30d',
    });
    return refresh_token;
  }

  async refreshToken(id: number, email: string): Promise<string> {
    const payload = { email: email, sub: id };
    const tokens = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.access_secret,
      expiresIn: '30m',
    });
    return tokens;
  }
}
