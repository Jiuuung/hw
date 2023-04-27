import { UserRepository } from './users.repository';
import { UserFindInputDto, UserRequestDto } from './dto/users.request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  UserCreateReturnDto,
  UserDeleteInputDto,
  UserDeleteReturnDto,
  UserFindDto,
} from './dto/users.return.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findUsers(body: UserFindInputDto): Promise<UserFindDto[]> {
    return await this.userRepository.findUsers(body);
  }
  async signUp(body: UserRequestDto): Promise<UserCreateReturnDto> {
    const { email, first_name, last_name, password } = body;
    const isUserExists = await this.userRepository.findByEmail(email);
    if (isUserExists) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });
    return user;
  }

  async delete(users: any): Promise<UserDeleteReturnDto> {
    const user: UserDeleteInputDto = await this.userRepository.findByEmail(
      users.email,
    );
    return await this.userRepository.delete(user);
  }
}
