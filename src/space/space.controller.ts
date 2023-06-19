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
  SpaceRequestMakeDTO,
  SpaceRequestJoinDTO,
  SpaceRequestUserRoleDTO,
  SpaceRequestMakeRoleDTO,
  SpaceRequestDeleteRoleDTO,
  SpaceRequestChangeRoleDTO,
} from './dto/space.request.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/auth/jwt/access.guard';
import { Request } from 'express';
import { UserReturnDTO } from 'src/users/dto/users.return.dto';
import { AuthorizationUserGuard } from 'src/auth/jwt/authorizationuser.guard';
import { AuthorizationAdminGuard } from 'src/auth/jwt/authorizationadmin.guard';
import {
  SpaceReturnCreateDTO,
  SpaceReturnJoinDTO,
  SpaceReturnMkOrChangeRoleDTO,
} from './dto/space.return.dto';
import { UserRequest } from 'src/common/decorator/common.decorator';
import { CommonRequestUserDTO } from 'src/common/dto/common.request.dto';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new/space/:spacename')
  async makeSpace(
    @Body() body: SpaceRequestMakeDTO,
    @UserRequest() user,
  ): Promise<SpaceReturnCreateDTO> {
    if (body.manager_role.includes(body.my_role)) {
      return this.spaceService.makeSpace(
        body.spacename,
        user,
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
    @UserRequest() user,
  ): Promise<string> {
    return await this.spaceService.checkCodeManager(params.spacename, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('exist/:spacename')
  async joinSpace(
    @Body() body: SpaceRequestJoinDTO,
    @UserRequest() user,
  ): Promise<SpaceReturnJoinDTO> {
    return await this.spaceService.joinSpace(
      body.spacename,
      body.access_code,
      body.rolename,
      user,
    );
  }

  @UseGuards(AuthorizationUserGuard)
  @Get('users/role/:spacename')
  async userRoleInSpace(
    @Body() body: SpaceRequestUserRoleDTO,
  ): Promise<UserReturnDTO[]> {
    //해당 공간 내에 해당 역할군에 포함되어 있는 유저들의 정보.
    return await this.spaceService.userRoleInSpace(
      body.spacename,
      body.rolename,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Put('users/role/:spacename')
  async changeRoleInSpace(
    @Body(new ParseArrayPipe({ items: SpaceRequestChangeRoleDTO }))
    userlist: SpaceRequestChangeRoleDTO[],
    @UserRequest() user: CommonRequestUserDTO,
    @Param() params,
  ): Promise<boolean[]> {
    return await this.spaceService.changeRoleInSpace(
      userlist,
      user.email,
      params.spacename,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Post('new/role/:spacename')
  async makeNewRole(
    @Body() body: SpaceRequestMakeRoleDTO,
  ): Promise<SpaceReturnMkOrChangeRoleDTO> {
    return await this.spaceService.makeOrChangeRole(
      body.rolename,
      body.auth,
      body.spacename,
    );
  }

  @UseGuards(AuthorizationAdminGuard)
  @Delete('role/:spacename')
  async deleteRole(@Body() body: SpaceRequestDeleteRoleDTO): Promise<boolean> {
    return await this.spaceService.deleteRole(body.spacename, body.rolename);
  }

  @UseGuards(AuthorizationAdminGuard)
  @Delete(':spacename')
  async deleteSpace(@Param() param): Promise<boolean> {
    return await this.spaceService.deleteSpace(param.spacename);
  }
}
