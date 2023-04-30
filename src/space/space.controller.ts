import { Space, User } from '@prisma/client';
import { AuthService } from './../auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  ParseArrayPipe,
  Put,
  Delete,
} from '@nestjs/common';
import {
  MakeSpaceDto,
  SpaceDeleteRoleBodyDto,
  SpaceJoinBodyDto,
  SpaceMakeRoleBodyDto,
  SpaceUserRoleBodyDto,
} from './dto/space.request.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/auth/jwt/access.guard';
import { Request } from 'express';
import { ChangeRoleDto } from './dto/space.changerole.dto';
import {
  MkOrChangeRoleReturnDto,
  SpaceCodeManagerReturnDto,
  SpaceCreateReturnDto,
  SpaceJoinReturnDto,
} from './dto/space.return.dto';
import { UserReturnDto } from 'src/users/dto/users.return.dto';
import { AuthorizationUserGuard } from 'src/auth/jwt/authorizationuser.guard';
import { AuthorizationAdminGuard } from 'src/auth/jwt/authorizationadmin.guard';

@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new/space/:spacename')
  async makeSpace(
    @Body() body: MakeSpaceDto,
    @Req() req: Request,
  ): Promise<SpaceCreateReturnDto> {
    if (body.manager_role.includes(body.my_role)) {
      return this.spaceService.makeSpace(
        body.spacename,
        req.user,
        body.manager_role,
        body.user_role,
        body.my_role,
      );
    } else {
      throw new Error('my_role is not in manager_role set');
    }
  }

  @UseGuards(AuthorizationAdminGuard)
  @Get(':spacename')
  async checkCodeManager(
    @Param() params,
    @Req() req,
  ): Promise<SpaceCodeManagerReturnDto> {
    return await this.spaceService.checkCodeManager(params.spacename, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('exist/:spacename')
  async joinSpace(
    @Body() body: SpaceJoinBodyDto,
    @Req() req,
  ): Promise<SpaceJoinReturnDto> {
    return await this.spaceService.joinSpace(
      body.spacename,
      body.access_code,
      body.rolename,
      req.user,
    );
  }

  @UseGuards(AuthorizationUserGuard)
  @Get('users/role/:spacename')
  async userRoleInSpace(
    @Body() body: SpaceUserRoleBodyDto,
    @Req() req,
  ): Promise<UserReturnDto[]> {
    //해당 공간 내에 해당 역할군에 포함되어 있는 유저들의 정보.
    return await this.spaceService.userRoleInSpace(
      req.user,
      body.spacename,
      body.rolename,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Put('users/role/:spacename')
  async changeRoleInSpace(
    @Body(new ParseArrayPipe({ items: ChangeRoleDto }))
    userlist: ChangeRoleDto[],
    @Req() req,
    @Param() params,
  ): Promise<boolean> {
    return await this.spaceService.changeRoleInSpace(
      userlist,
      req.user.email,
      params.spacename,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Post('new/role/:spacename')
  async makeNewRole(
    @Body() body: SpaceMakeRoleBodyDto,
    @Req() req,
  ): Promise<MkOrChangeRoleReturnDto> {
    return await this.spaceService.makeOrChangeRole(
      body.rolename,
      body.auth,
      body.spacename,
      req.user.email,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Delete('role/:spacenam')
  async deleteRole(
    @Body() body: SpaceDeleteRoleBodyDto,
    @Req() req,
  ): Promise<boolean> {
    return await this.spaceService.deleteRole(
      body.spacename,
      body.rolename,
      req.user.email,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Delete(':spacename')
  async deleteSpace(@Param() param): Promise<boolean> {
    return await this.spaceService.deleteSpace(param.spacename);
  }
}
