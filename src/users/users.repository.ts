import { RefreshTokenStrategy } from './../auth/jwt/refresh.strategy';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequestDto } from 'src/users/dto/users.request.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
    return user;
  }
  async findUserWithoutPassword(id: number): Promise<{
    email: string;
    first_name: string;
    last_name: string;
    refresh_token: string;
    imgUrl: string | null;
  } | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      select: {
        email: true,
        first_name: true,
        last_name: true,
        refresh_token: true,
        imgUrl: true,
      },
    });
    return user;
  }

  async isExistByEmail(email: string): Promise<boolean> {
    const isExist = await this.prisma.user.findFirst({
      where: { email: email, isDeleted: false },
    });
    if (!isExist) {
      return false;
    } else {
      return true;
    }
  }
  async create(
    user: UserRequestDto,
  ): Promise<{ email: string; first_name: string; last_name: string }> {
    const { email, first_name, last_name, password } = user;
    return await this.prisma.user.create({
      select: { email: true, first_name: true, last_name: true },
      data: { email, first_name, last_name, password },
    });
  }

  async delete(users: { id: number }) {
    await this.prisma.usersInSpaces.deleteMany({ where: { userId: users.id } });
    return await this.prisma.user.update({
      where: { id: users.id },
      data: { isDeleted: true },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashrefreshToken = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: hashrefreshToken },
    });
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  }
}
