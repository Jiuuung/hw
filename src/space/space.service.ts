import { UserReturnDTO } from './../users/dto/users.return.dto';
import { UserRepository } from 'src/users/users.repository';
import { SpaceRepository } from './space.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, Auth } from '@prisma/client';
import {
  SpaceReturnCreateDTO,
  SpaceReturnJoinDTO,
  SpaceReturnMkOrChangeRoleDTO,
} from './dto/space.return.dto';
import { SpaceRequestChangeRoleDTO } from './dto/space.request.dto';

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
  ): Promise<SpaceReturnCreateDTO> {
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

  async checkCodeManager(name: string, user: any): Promise<string> {
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
  ): Promise<SpaceReturnJoinDTO> {
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
    spacename: string,
    rolename: string,
  ): Promise<UserReturnDTO[]> {
    const space = await this.spaceRepository.findSpaceByName(spacename);
    console.log(space);
    if (!space) {
      throw new UnauthorizedException('no space found');
    } else {
      const userroleinspace = (
        await this.spaceRepository.allUsersWithRole(rolename, spacename)
      ).map((user) => {
        user.refresh_token = '';
        return user;
      });
      return userroleinspace;
    }
  }

  async changeRoleInSpace(
    userlist: SpaceRequestChangeRoleDTO[],
    email: string,
    spacename: string,
  ): Promise<boolean[]> {
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
  ): Promise<SpaceReturnMkOrChangeRoleDTO> {
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

  async deleteRole(spacename: string, rolename: string): Promise<boolean> {
    return await this.spaceRepository.deleteRole(spacename, rolename);
  }

  async deleteSpace(spacename: string): Promise<boolean> {
    return await this.spaceRepository.deleteSpace(spacename);
  }
}
