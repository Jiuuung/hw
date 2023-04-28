import { UserReturnDto } from './../users/dto/users.return.dto';
import { UserRequestDto } from './../users/dto/users.request.dto';
import { UserRepository } from 'src/users/users.repository';
import { SpaceRepository } from './space.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MakeSpaceDto } from './dto/space.request.dto';
import { User, Auth } from '@prisma/client';
import { ChangeRoleDto } from './dto/space.changerole.dto';
import {
  MkOrChangeRoleReturnDto,
  SpaceCodeManagerReturnDto,
  SpaceCreateReturnDto,
  SpaceJoinReturnDto,
} from './dto/space.return.dto';

@Injectable()
export class SpaceService {
  constructor(
    private readonly spaceRepository: SpaceRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async makeSpace(
    name: string,
    user: any,
    manager_role: string[],
    user_role: string[],
    my_role: string,
  ): Promise<boolean> {
    const cur_user = await this.userRepository.findByEmail(user.email);
    if (!cur_user) {
      throw new UnauthorizedException('no user found');
    } else {
      const space = await this.spaceRepository.createSpace(
        name,
        cur_user,
        manager_role,
        user_role,
        my_role,
      );
      return space;
    }
  }

  async checkCodeManager(
    name: string,
    user: any,
  ): Promise<SpaceCodeManagerReturnDto> {
    const cur_user = await this.userRepository.findByEmail(user.email);
    if (!cur_user) {
      throw new UnauthorizedException('no user found');
    } else {
      const tar_space = await this.spaceRepository.findSpaceByName(name);
      if (!tar_space) {
        throw new UnauthorizedException('no space found');
      } else {
        return await this.spaceRepository.checkCodeManager(tar_space.id);
      }
    }
  }

  async joinSpace(
    space: string,
    code: string,
    rolename: string,
    user: User,
  ): Promise<SpaceJoinReturnDto> {
    const cur_user = await this.userRepository.findByEmail(user.email);
    if (!cur_user) {
      throw new UnauthorizedException('no user found');
    } else {
      const isInSpace = await this.spaceRepository.isUserInSpace(
        cur_user.email,
        space,
      );
      if (isInSpace) {
        throw new UnauthorizedException(' alerady in space');
      } else {
        return await this.spaceRepository.joinSpace(
          space,
          code,
          rolename,
          cur_user,
        );
      }
    }
  }

  async userRoleInSpace(
    user: UserRequestDto,
    spacename: string,
    rolename: string,
  ): Promise<UserReturnDto[]> {
    const space = await this.spaceRepository.findSpaceByName(spacename);
    console.log(space);
    if (!space) {
      throw new UnauthorizedException('no space found');
    } else {
      return await this.spaceRepository.allUsersWithRole(rolename, spacename);
    }
  }

  async changeRoleInSpace(
    userlist: ChangeRoleDto[],
    email: string,
    spacename: string,
  ): Promise<boolean> {
    const isUserInSpace = await this.spaceRepository.GetAdminUserInSpace(
      email,
      spacename,
    );
    const result = await this.spaceRepository.changeRole(
      userlist,
      spacename,
      isUserInSpace,
    );
    return result;
  }

  async makeOrChangeRole(
    rolename: string,
    auth: string,
    spacename: string,
    email: string,
  ): Promise<MkOrChangeRoleReturnDto> {
    let newauth: Auth;
    if (auth === 'admin') {
      newauth = Auth.ADMIN;
    } else if (auth === 'user') {
      newauth = Auth.USER;
    } else {
      throw new UnauthorizedException('auth must be admin or user');
    }
    return await this.spaceRepository.makeOrChangeRole(
      rolename,
      newauth,
      spacename,
    );
  }

  async deleteRole(
    spacename: string,
    rolename: string,
    email: string,
  ): Promise<boolean> {
    return await this.spaceRepository.deleteRole(spacename, rolename);
  }

  async deleteSpace(spacename: string): Promise<boolean> {
    return await this.spaceRepository.deleteSpace(spacename);
  }
}
