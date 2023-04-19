import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Space, User, Role, Auth, Prisma, UsersInSpaces } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ChangeRoleDto } from './dto/space.changerole.dto';

@Injectable()
export class SpaceRepository {
  constructor(private prisma: PrismaService) {}

  async getUserId(email: string): Promise<{ id: number }> {
    return this.prisma.user.findFirst({
      where: { email: email, isDeleted: false },
      select: { id: true },
    });
  }
  async getSpaceId(spacename: string): Promise<{ id: number }> {
    return this.prisma.space.findFirst({
      where: { name: spacename, isDeleted: false },
      select: { id: true },
    });
  }
  async getRoleId(name: string, spacename: string): Promise<{ id: number }> {
    return this.prisma.space.findFirst({
      where: { name: spacename, isDeleted: false },
      select: { id: true },
    });
  }

  async findSpaceByName(
    name: string,
  ): Promise<{ id: number; name: string; users: UsersInSpaces[] } | null> {
    const space = this.prisma.space.findFirst({
      include: { users: true },
      where: { name: name, isDeleted: false },
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
  async checkCodeManager(id: number): Promise<{ access_code_manager: string }> {
    const code = await this.prisma.space.findFirst({
      where: { id: id, isDeleted: false },
      select: { access_code_manager: true },
    });
    return code;
  }
  async createSpace(name: string, cur_user: User) {
    const isExist = await this.findSpaceByName(name);
    if (isExist) {
      throw new UnauthorizedException('space name alerady exists');
    } else {
      const code_manager = this.random_code();
      const code_participation = this.random_code();
      const m_space = await this.prisma.space.create({
        data: {
          name: name,
          access_code_manager: code_manager,
          access_code_participation: code_participation,
        },
      });
      const m_role = await this.prisma.role.create({
        data: {
          name: 'prof',
          auth: Auth.ADMIN,
          spacename: m_space.name,
        },
      });
      const userinspace = await this.prisma.usersInSpaces.create({
        data: {
          user: { connect: { id: cur_user.id } },
          space: { connect: { id: m_space.id } },
          role: { connect: { id: m_role.id } },
        },
      });
      return userinspace;
    }
  }
  random_code() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  async joinSpace(name: string, code: string, rolename: string, user: User) {
    let role = true;
    return await this.prisma.$transaction(async (tx) => {
      let tar_space = await tx.space.findFirst({
        where: {
          name: name,
          access_code_manager: code,
          isDeleted: false,
        },
        select: { id: true, name: true },
      });
      if (!tar_space) {
        tar_space = await tx.space.findFirstOrThrow({
          where: {
            name: name,
            isDeleted: false,
            access_code_participation: code,
          },
          select: { id: true, name: true },
        });
        role = false;
      }
      const m_role = await tx.role.upsert({
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
        const userinspace = await tx.usersInSpaces.create({
          data: {
            user: { connect: { id: user.id } },
            space: { connect: { id: tar_space.id } },
            role: { connect: { id: m_role.id } },
          },
        });
        return userinspace;
      }
    });
  }

  async isUserInSpace(email: string, spacename: string): Promise<boolean> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email: email, isDeleted: false },
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

  async isUserInSpaceWithAuth(
    email: string,
    spacename: string,
  ): Promise<{ spaceId: number; roleId: number } | null> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email: email, isDeleted: false },
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

  async allUsersWithRole(rolename: string, spacename: string) {
    const users = await this.prisma.user.findMany({
      where: {
        spaces: {
          some: { role: { name: rolename, spacename: spacename } },
        },
      },
    });
    return users;
  }

  async makeOrChangeRole(rolename: string, auth: Auth, spacename: string) {
    return await this.prisma.role.upsert({
      where: { roleinspace: { name: rolename, spacename: spacename } },
      update: { auth: auth },
      create: { name: rolename, spacename, auth: auth },
    });
  }

  async changeRole(
    userlist: ChangeRoleDto[],
    spacename: string,
    spaceAndrole: { spaceId: number; roleId: number },
  ) {
    const result = userlist.forEach(async (user) => {
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
        const updaterole = await this.prisma.usersInSpaces.update({
          where: {
            userspace: { userId: user.userId, spaceId: spaceAndrole.spaceId },
          },
          data: { roleId: roleId.id },
        });
        return 'success';
      }
      return 'fail';
    });
    return result;
  }

  async deleteRole(spacename: string, rolename: string) {
    const roleId = await this.getRoleId(spacename, rolename);
    const remainUser = this.prisma.usersInSpaces.findFirst({
      where: { role: roleId },
    });
    if (remainUser) {
      throw new UnauthorizedException(
        'There must not be a user assigned that role.',
      );
    } else {
      return await this.prisma.role.update({
        where: {
          roleinspace: { name: rolename, spacename: spacename },
        },
        data: { isDeleted: true },
      });
    }
  }
}
