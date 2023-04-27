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
} from '@nestjs/common';
import { UserRequestDto } from './dto/users.request.dto';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/auth/jwt/refresh.guard';
import {
  UserCreateReturnDto,
  UserDeleteReturnDto,
} from './dto/users.return.dto';

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
    return req.user;
  } //for testing purposes

  @Post('signup')
  async signUp(@Body() body: UserRequestDto): Promise<UserCreateReturnDto> {
    return this.usersService.signUp(body);
  }

  @Post('login')
  login(@Body() body: LoginRequestDto): Promise<any> {
    return this.authService.jwtLogin(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('logout')
  logout(@Req() req: Request): Promise<boolean> {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Req() req: Request): Promise<UserDeleteReturnDto> {
    return this.usersService.delete(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<string> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('profileimg')
  uploadProfileImage(): string {
    return 'upload';
  } // not implemented yet
}
