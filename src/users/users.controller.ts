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
} from '@nestjs/common';
import { UserRequestDto } from './dto/users.request.dto';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/auth/jwt/refresh.guard';

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
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }

  @Post('signup')
  async signUp(@Body() body: UserRequestDto) {
    console.log(body);
    return this.usersService.signUp(body);
  }

  @Post('login')
  login(@Body() body: LoginRequestDto) {
    return this.authService.jwtLogin(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async delete(@Req() req: Request) {
    return this.usersService.delete(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('upload/profileimg')
  uploadProfileImage() {
    return 'upload';
  }
}
