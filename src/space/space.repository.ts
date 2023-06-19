import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, Auth } from '@prisma/client';
import { UserReturnDTO } from 'src/users/dto/users.return.dto';
import { SpaceRequestChangeRoleDTO } from './dto/space.request.dto';
import {
  SpaceReturnAdminDTO,
  SpaceReturnCreateDTO,
  SpaceReturnDTO,
  SpaceReturnIdDTO,
  SpaceReturnJoinDTO,
  SpaceReturnMkOrChangeRoleDTO,
} from './dto/space.return.dto';

@Injectable()
export class SpaceRepository {
  constructor(private prisma: PrismaService) {}

  async getUserId(email: string): Promise<number> {
    return (
      await this.prisma.user.findUnique({
        where: { email: email },
        select: { id: true },
      })
    )?.id;
  }
  async getSpaceId(spacename: string): Promise<number> {
    return (
      await this.prisma.space.findFirst({
        where: { name: spacename, isDeleted: false },
        select: { id: true },
      })
    )?.id;
  }
  async getRoleId(name: string, spacename: string): Promise<number> {
    return (
      await this.prisma.role.findFirst({
        where: { name: name, spacename: spacename, isDeleted: false },
        select: { id: true },
      })
    )?.id;
  }

  async findSpaceByName(name: string): Promise<SpaceReturnDTO | null> {
    const space = this.prisma.space.findFirst({
      where: { name: name, isDeleted: false },
      select: { id: true, name: true, users: true },
    });
    return space;
  }
  async checkUserRoleInSpace(spaceId: number, userId: number): Promise<Role> {
    const userinspace = await this.prisma.usersInSpaces.findFirst({
      where: { userId: userId, spaceId: spaceId },
      include: { role: true },
    });
    const role = userinspace.role;
    return role;
  }
  async checkCodeManager(id: number): Promise<string> {
    return (
      await this.prisma.space.findFirst({
        where: { id: id, isDeleted: false },
        select: { access_code_manager: true },
      })
    ).access_code_manager;
  }
  async createSpace(
    name: string,
    cur_user: UserReturnDTO,
    manager_role: string[],
    user_role: string[],
    my_role: string,
  ): Promise<SpaceReturnCreateDTO> {
    const isExist = await this.findSpaceByName(name);
    if (isExist) {
      throw new UnauthorizedException('space name alerady exists');
    } else {
      const code_manager: string = this.random_code();
      const code_participation: string = this.random_code();
      const m_space = await this.prisma.space.create({
        data: {
          name: name,
          access_code_manager: code_manager,
          access_code_participation: code_participation,
        },
      });
      manager_role.map(async (role) => {
        if (role === my_role) {
          const m_role_id = await this.prisma.role.create({
            data: {
              name: role,
              auth: Auth.ADMIN,
              spacename: m_space.name,
            },
            select: { id: true },
          });
          await this.prisma.usersInSpaces.create({
            data: {
              user: { connect: { id: cur_user.id } },
              space: { connect: { id: m_space.id } },
              role: { connect: { id: m_role_id.id } },
            },
          });
        } else {
          await this.prisma.role.create({
            data: {
              name: role,
              auth: Auth.ADMIN,
              spacename: m_space.name,
            },
          });
        }
      });
      user_role.map(async (role) => {
        await this.prisma.role.create({
          data: {
            name: role,
            auth: Auth.USER,
            spacename: m_space.name,
          },
        });
      });
      return {
        access_code_manager: code_manager,
        access_code_participation: code_participation,
      };
    }
  }
  random_code(): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  async joinSpace(
    name: string,
    code: string,
    rolename: string,
    user: UserReturnDTO,
  ): Promise<SpaceReturnJoinDTO> {
    let role = true;
    let tar_space = await this.prisma.space.findFirst({
      where: {
        name: name,
        access_code_manager: code,
        isDeleted: false,
      },
      select: { id: true, name: true },
    });
    if (!tar_space) {
      tar_space = await this.prisma.space.findFirstOrThrow({
        where: {
          name: name,
          isDeleted: false,
          access_code_participation: code,
        },
        select: { id: true, name: true },
      });
      role = false;
    }
    const m_role = await this.prisma.role.upsert({
      where: {
        roleinspace: { name: rolename, spacename: tar_space.name },
      },
      update: {},
      create: {
        name: rolename,
        auth: role ? Auth.ADMIN : Auth.USER,
        spacename: tar_space.name,
      },
    });
    if (m_role.auth !== (role ? Auth.ADMIN : Auth.USER)) {
      throw new UnauthorizedException(
        'already exist role name with different auth',
      );
    } else {
      const userinspace = await this.prisma.usersInSpaces.create({
        data: {
          user: { connect: { id: user.id } },
          space: { connect: { id: tar_space.id } },
          role: { connect: { id: m_role.id } },
        },
      });
      return userinspace;
    }
  }

  async isUserInSpace(email: string, spacename: string): Promise<boolean> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: email },
    });
    const space = await this.prisma.space.findFirstOrThrow({
      where: { name: spacename, isDeleted: false },
      select: { id: true },
    });
    const isuserinspace = await this.prisma.usersInSpaces.findFirst({
      where: { userId: user.id, spaceId: space.id },
    });
    if (isuserinspace) {
      return true;
    } else {
      return false;
    }
  }
  async isUserInSpacePassId(
    email: string,
    spacename: string,
  ): Promise<SpaceReturnIdDTO | null> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: email },
    });
    const space = await this.prisma.space.findFirstOrThrow({
      where: { name: spacename, isDeleted: false },
      select: { id: true },
    });
    return await this.prisma.usersInSpaces.findFirst({
      where: { userId: user.id, spaceId: space.id },
      select: { userId: true, spaceId: true },
    });
  }

  async GetAdminUserInSpace(
    email: string,
    spacename: string,
  ): Promise<SpaceReturnAdminDTO | null> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: email },
    });
    const space = await this.prisma.space.findFirstOrThrow({
      where: { name: spacename, isDeleted: false },
      select: { id: true },
    });
    const isuserinspace = await this.prisma.usersInSpaces.findFirst({
      where: { userId: user.id, spaceId: space.id, role: { auth: Auth.ADMIN } },
      select: { spaceId: true, roleId: true },
    });
    return isuserinspace;
  }

  async allUsersWithRole(
    rolename: string,
    spacename: string,
  ): Promise<UserReturnDTO[]> {
    const users = await this.prisma.user.findMany({
      where: {
        spaces: {
          some: { role: { name: rolename, spacename: spacename } },
        },
      },
      select: {
        id: true,
        email: true,
        password: false,
        first_name: true,
        last_name: true,
        imgUrl: true,
        refresh_token: true,
      },
    });
    return users;
  }

  async makeOrChangeRole(
    rolename: string,
    auth: Auth,
    spacename: string,
  ): Promise<SpaceReturnMkOrChangeRoleDTO> {
    return await this.prisma.role.upsert({
      where: { roleinspace: { name: rolename, spacename: spacename } },
      update: { auth: auth },
      create: { name: rolename, spacename, auth: auth },
      select: { name: true, spacename: true, auth: true },
    });
  }

  async changeRole(
    userlist: SpaceRequestChangeRoleDTO[],
    spacename: string,
    spaceAndrole: { spaceId: number; roleId: number },
  ): Promise<boolean[]> {
    const result = await Promise.all(
      userlist.map(async (user) => {
        const checkvaliduser = await this.prisma.usersInSpaces.findFirst({
          where: {
            userId: user.userId,
            spaceId: spaceAndrole.spaceId,
          },
        });
        const checkvalidrole = await this.prisma.role.findUnique({
          where: {
            roleinspace: { name: user.role, spacename: spacename },
          },
        });
        if (checkvalidrole && checkvaliduser) {
          const roleId = await this.getRoleId(user.role, spacename);
          await this.prisma.usersInSpaces.update({
            where: {
              userspace: { userId: user.userId, spaceId: spaceAndrole.spaceId },
            },
            data: { roleId: roleId },
          });
          return true;
        }
        return false;
      }),
    );
    return result;
  }

  async deleteRole(spacename: string, rolename: string): Promise<boolean> {
    const roleId = await this.getRoleId(rolename, spacename);
    if (!roleId) throw new UnauthorizedException('role is not in space');
    const remainUser = await this.prisma.usersInSpaces.findFirst({
      where: { roleId: roleId },
    });
    if (remainUser) {
      throw new UnauthorizedException(
        'There must not be a user assigned that role.',
      );
    } else {
      await this.prisma.role.update({
        where: {
          roleinspace: { name: rolename, spacename: spacename },
        },
        data: { isDeleted: true },
      });
      return true;
    }
  }

  async deleteSpace(spacename: string): Promise<boolean> {
    await this.prisma.space.update({
      where: { name: spacename },
      data: { isDeleted: true },
    });
    return true;
  }
}
