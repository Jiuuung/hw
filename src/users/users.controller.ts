import { AuthUserInfoDTO } from './../auth/dto/login.request.dto';
import { User } from '@prisma/client';
import { AuthService } from './../auth/auth.service';
import { ScuccessInterceptor } from './../common/interceptor/success.interceptor';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseInterceptors,
  UseFilters,
  UseGuards,
  Req,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { UserFindInputDto, UserRequestDto } from './dto/users.request.dto';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access.guard';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from 'src/auth/jwt/refresh.guard';
import {
  UserCreateReturnDto,
  UserDeleteReturnDto,
  UserFindDto,
} from './dto/users.return.dto';
import { UserRequest } from 'src/common/decorator/common.decorator';

@Controller('users')
@UseInterceptors(ScuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Req() req: Request): Express.User {
    console.log(req.cookies);
    return req.user;
  } //for testing purposes

  @Get('find')
  async findUsers(@Body() body: UserFindInputDto): Promise<UserFindDto[]> {
    return await this.usersService.findUsers(body);
  }
  @Post('signup')
  async signUp(@Body() body: UserRequestDto): Promise<UserCreateReturnDto> {
    return this.usersService.signUp(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const { accessToken, refreshToken } = await this.authService.jwtLogin(body);
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('jwt', refreshToken, { httpOnly: true });
    //res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });
    return 'success';
  }

  @UseGuards(JwtAuthGuard)
  @Put('logout')
  async logout(
    @UserRequest() user: AuthUserInfoDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(
    @UserRequest() user: AuthUserInfoDTO,
  ): Promise<UserDeleteReturnDto> {
    return this.usersService.delete(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @UserRequest() user: AuthUserInfoDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const accessToken = await this.authService.refreshToken(
      user.id,
      user.email,
    );
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    return true;
  }

  @Post('profileimg')
  uploadProfileImage(): string {
    return 'upload';
  } // not implemented yet
}
