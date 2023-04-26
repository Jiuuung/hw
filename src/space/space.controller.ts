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
} from '@nestjs/common';
import { MakeSpaceDto } from './dto/space.request.dto';
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
import { AuthorizationUserGuard } from 'src/auth/jwt/authorizationuser.gurard';
import { AuthorizationAdminGuard } from 'src/auth/jwt/authorizationadmin.gurard';

@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/make/:name')
  async makeSpace(
    @Param() params,
    @Req() req: Request,
  ): Promise<SpaceCreateReturnDto> {
    return this.spaceService.makeSpace(params.name, req.user);
  }

  @UseGuards(AuthorizationAdminGuard)
  @Get('/checkcode/manager/:name')
  async checkCodeManager(
    @Param() params,
    @Req() req,
  ): Promise<SpaceCodeManagerReturnDto> {
    return await this.spaceService.checkCodeManager(params.name, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/join/:name/:code/:rolename')
  async joinSpace(@Param() params, @Req() req): Promise<SpaceJoinReturnDto> {
    return await this.spaceService.joinSpace(
      params.name,
      params.code,
      params.rolename,
      req.user,
    );
  }

  @UseGuards(AuthorizationUserGuard)
  @Post('/users/:spacename/role/:rolename')
  async userRoleInSpace(@Param() params, @Req() req): Promise<UserReturnDto[]> {
    //해당 공간 내에 해당 역할군에 포함되어 있는 유저들의 정보.
    return await this.spaceService.userRoleInSpace(
      req.user,
      params.spacename,
      params.rolename,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Post('/users/:spacename/changerole')
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
  @Get('/make/space/:spacename/role/:rolename/auth/:auth')
  async makeNewRole(
    @Param() param,
    @Req() req,
  ): Promise<MkOrChangeRoleReturnDto> {
    return await this.spaceService.makeOrChangeRole(
      param.rolename,
      param.auth,
      param.spacename,
      req.user.email,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Get('/delete/space/:spacename/role/:rolename')
  async deleteRole(@Param() param, @Req() req): Promise<boolean> {
    return await this.spaceService.deleteRole(
      param.spacename,
      param.rolename,
      req.user.email,
    );
  }
}
