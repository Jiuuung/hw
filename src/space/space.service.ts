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

  async makeSpace(name: string, user: any): Promise<SpaceCreateReturnDto> {
    const cur_user = await this.userRepository.findByEmail(user.email);
    if (!cur_user) {
      throw new UnauthorizedException('no user found');
    } else {
      const space = await this.spaceRepository.createSpace(name, cur_user);
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
        const userRole = await this.spaceRepository.checkUserRoleInSpace(
          tar_space.id,
          cur_user.id,
        );
        if (userRole.auth === Auth.ADMIN) {
          return await this.spaceRepository.checkCodeManager(tar_space.id);
        } else {
          throw new UnauthorizedException('only admin can check code');
        }
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
  ): Promise<User[]> {
    const space = await this.spaceRepository.findSpaceByName(spacename);
    if (!space) {
      throw new UnauthorizedException('no space found');
    } else {
      const isInSpace = await this.spaceRepository.isUserInSpace(
        user.email,
        spacename,
      );
      if (isInSpace) {
        return await this.spaceRepository.allUsersWithRole(rolename, spacename);
      } else {
        throw new UnauthorizedException('user is not in space');
      }
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
    if (isUserInSpace) {
      const result = await this.spaceRepository.changeRole(
        userlist,
        spacename,
        isUserInSpace,
      );
      return result;
    } else {
      throw new UnauthorizedException('only ADMIN can change role');
    }
  }

  async makeOrChangeRole(
    rolename: string,
    auth: string,
    spacename: string,
    email: string,
  ): Promise<MkOrChangeRoleReturnDto> {
    const isuserinspacewithadmin =
      await this.spaceRepository.GetAdminUserInSpace(email, spacename);
    let newauth: Auth;
    if (isuserinspacewithadmin) {
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
    } else {
      throw new UnauthorizedException('only ADMIN can change role');
    }
  }

  async deleteRole(
    spacename: string,
    rolename: string,
    email: string,
  ): Promise<boolean> {
    const isuserinspacewithadmin =
      await this.spaceRepository.GetAdminUserInSpace(email, spacename);
    if (isuserinspacewithadmin) {
      return await this.spaceRepository.deleteRole(spacename, rolename);
    } else {
      throw new UnauthorizedException('only ADMIN can delete role');
    }
  }
}
