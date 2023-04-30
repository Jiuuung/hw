import { PostService } from './post.service';
import { AdminPostDto } from './dto/post.admin.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { ScuccessInterceptor } from 'src/common/interceptor/success.interceptor';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/access.guard';
import {
  MakePostAdminReturnDto,
  MakePostUserReturnDto,
  PostAllReturnDto,
  PostAnonymousReturnDto,
  PostListReturn,
} from './dto/post.return.dto';
import { AuthorizationUserGuard } from 'src/auth/jwt/authorizationuser.guard';
import { UserRoleGuard } from 'src/auth/jwt/authorole.guard';
import { UserAdminDisting, UserRequest } from './post.decorator';
import { PostDto } from './dto/post.user.dto';
import { Auth } from '@prisma/client';
import { RequestUserDto } from 'src/common/DTO/common.dto';
import { PostDeleteGuard } from 'src/auth/jwt/postdelete.guard';

@Controller('post')
@UseInterceptors(ScuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(UserRoleGuard)
  @Post('/:spacename')
  async makePost(
    @Param() param,
    @UserAdminDisting() body: PostDto,
    @Req() req: Request,
  ): Promise<MakePostUserReturnDto | MakePostAdminReturnDto> {
    if (body.auth === Auth.ADMIN) {
      return await this.postService.makeAdminPost(
        param.spacename,
        body,
        req.user,
      );
    } else {
      return await this.postService.makeUserPost(
        param.spacename,
        body,
        req.user,
      );
    }
    //
  }

  @UseGuards(UserRoleGuard)
  @Get('/:spacename')
  async listPost(
    @Param() param,
    @UserAdminDisting() body,
    @UserRequest() req: RequestUserDto,
  ): Promise<PostListReturn[]> {
    return await this.postService.listPost(
      param.spacename,
      body.auth,
      req.email,
    );
  }

  @UseGuards(UserRoleGuard)
  @Get('/:spacename/:postid')
  async seePost(
    @Param() param,
    @UserAdminDisting() body,
    @UserRequest() req: RequestUserDto,
  ): Promise<PostAnonymousReturnDto | PostAllReturnDto | null> {
    return await this.postService.seePost(
      param.spacename,
      param.postid,
      req.email,
      body.auth,
    );
  }

  @UseGuards(PostDeleteGuard)
  @Delete('/:spacename/:postid')
  async deletePost(@Param() param): Promise<boolean> {
    await this.postService.deletePost(param.postid);
    return true;
  }
}
