import { UserRepository } from './users.repository';
import {
  UserRequestSignupDTO,
  UserRequestNameDTO,
} from './dto/users.request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  UserReturnCreateDTO,
  UserReturnDeleteDTO,
  UserReturnFindDTO,
} from './dto/users.return.dto';
import { AuthRequestUserDTO } from 'src/auth/dto/login.request.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findUsers(body: UserRequestNameDTO): Promise<UserReturnFindDTO[]> {
    return await this.userRepository.findUsers(body);
  }
  async signUp(body: UserRequestSignupDTO): Promise<UserReturnCreateDTO> {
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

  async delete(users: AuthRequestUserDTO): Promise<UserReturnDeleteDTO> {
    const user: AuthRequestUserDTO = await this.userRepository.findByEmail(
      users.email,
    );
    return await this.userRepository.delete(user);
  }
}
