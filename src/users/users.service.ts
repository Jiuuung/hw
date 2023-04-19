import { UserRepository } from './users.repository';
import { UserRequestDto } from './dto/users.request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async signUp(body: UserRequestDto) {
    const { email, first_name, last_name, password } = body;
    const isUserExists = await this.userRepository.isExistByEmail(email);
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

  async delete(users: any) {
    const user = await this.userRepository.findByEmail(users.email);
    return await this.userRepository.delete(user);
  }
}
