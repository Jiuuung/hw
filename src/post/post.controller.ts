import { PostService } from './post.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { ScuccessInterceptor } from 'src/common/interceptor/success.interceptor';
import { Request } from 'express';
import {
  PostReturnAdminMakeDTO,
  PostReturnUserMakeDTO,
  PostReturnDTO,
  PostReturnAnonymousDTO,
  PostReturnListDTO,
} from './dto/post.return.dto';
import { UserRoleGuard } from 'src/auth/jwt/authorole.guard';
import {
  AuthRequest,
  UserAdminDisting,
  UserRequest,
} from '../common/decorator/common.decorator';
import { Auth } from '@prisma/client';
import { CommonRequestUserDTO } from 'src/common/dto/common.request.dto';
import { PostDeleteGuard } from 'src/auth/jwt/postdelete.guard';
import {
  PostRequestAdminEditDTO,
  PostRequestUserDTO,
} from './dto/post.request.dto';

@Controller('post')
@UseInterceptors(ScuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(UserRoleGuard)
  @Post('/:spacename')
  async makePost(
    @Param() param,
    @UserAdminDisting() body: PostRequestUserDTO,
    @Req() req: Request,
  ): Promise<PostReturnUserMakeDTO | PostReturnAdminMakeDTO> {
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
    @UserRequest() req: CommonRequestUserDTO,
  ): Promise<PostReturnListDTO[]> {
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
    @UserRequest() req: CommonRequestUserDTO,
  ): Promise<PostReturnAnonymousDTO | PostReturnDTO | null> {
    return await this.postService.seePost(param.postid, req.email, body.auth);
  }
  @UseGuards(PostDeleteGuard)
  @Patch('/:spacename/:postid')
  async editPost(
    @AuthRequest() auth: Auth,
    @Param()
    param,
    @Body() body: PostRequestAdminEditDTO,
  ): Promise<PostReturnDTO> {
    return await this.postService.editPost(auth, body, param.postid);
  }

  @UseGuards(PostDeleteGuard)
  @Delete('/:spacename/:postid')
  async deletePost(@Param('postid', ParseIntPipe) id): Promise<boolean> {
    await this.postService.deletePost(id);
    return true;
  }
}
