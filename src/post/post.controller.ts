import { PostService } from './post.service';
import { AdminPostDto } from './dto/post.admin.dto';
import {
  Body,
  Controller,
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
} from './dto/post.return.dto';
import { AuthorizationUserGuard } from 'src/auth/jwt/authorizationuser.gurard';

@Controller('post')
@UseInterceptors(ScuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthorizationUserGuard)
  @Post('/:spacename')
  async makePost(
    @Param() param,
    @Body() body,
    @Req() req: Request,
  ): Promise<MakePostUserReturnDto | MakePostAdminReturnDto> {
    return await this.postService.makePost(param.spacename, body, req.user);
  }

  /*@UseGuards(JwtAuthGuard)
  @Get('see/:spacename/:postid')
  async seePost(@Param() param, @Req() req: Request) {
    return await this.postService.seePost(
      param.spacename,
      param.postid,
      req.user,
    );
  }*/
}
