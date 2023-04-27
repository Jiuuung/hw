import { UserFindInputDto } from './dto/users.request.dto';
import {
  UserReturnDto,
  UserCreateReturnDto,
  UserDeleteInputDto,
  UserDeleteReturnDto,
  UserRefreshTokenUpdateDto,
  UserReturnDtoWithPasswordDto,
  UserFindDto,
} from './dto/users.return.dto';
import { RefreshTokenStrategy } from './../auth/jwt/refresh.strategy';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequestDto } from 'src/users/dto/users.request.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findUsers(body: UserFindInputDto): Promise<UserFindDto[]> {
    return await this.prisma.user.findMany({
      where: { first_name: body.first_name, last_name: body.last_name },
      select: { first_name: true, last_name: true, imgUrl: true },
    });
  }
  async findByEmailWithPassword(
    email: string,
  ): Promise<UserReturnDtoWithPasswordDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        first_name: true,
        last_name: true,
        imgUrl: true,
        refresh_token: true,
      },
    });
    return user;
  }
  async findByEmail(email: string): Promise<UserReturnDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        imgUrl: true,
        refresh_token: true,
      },
    });
    return user;
  }
  async findUserWithoutPassword(id: number): Promise<UserReturnDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        refresh_token: true,
        imgUrl: true,
      },
    });
    return user;
  }

  async create(user: UserRequestDto): Promise<UserCreateReturnDto> {
    const { email, first_name, last_name, password } = user;
    return await this.prisma.user.create({
      select: { email: true, first_name: true, last_name: true },
      data: { email, first_name, last_name, password },
    });
  }

  async delete(users: UserDeleteInputDto): Promise<UserDeleteReturnDto> {
    await this.prisma.usersInSpaces.deleteMany({ where: { userId: users.id } });
    return await this.prisma.user.delete({
      where: { id: users.id },
      select: {
        email: true,
        first_name: true,
        last_name: true,
      },
    });
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const hashrefreshToken = await argon2.hash(refreshToken);
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refresh_token: hashrefreshToken },
      });
    } catch (err) {
      throw err;
    }
    return true;
  }

  async logout(userId: number): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refresh_token: null },
      });
    } catch (err) {
      throw err;
    }
    return true;
  }
}
