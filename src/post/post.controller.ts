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

@Controller('post')
@UseInterceptors(ScuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('make/:spacename')
  async makePost(@Param() param, @Body() body, @Req() req: Request) {
    return await this.postService.makePost(param.spacename, body, req.user);
  }

  /*
  @UseGuards(JwtAuthGuard)
  @Get('see/:spacename/:postid')
  async seePost(@Param() param, @Req() req: Request) {
    return await this.postService.seePost(
      param.spacename,
      param.postid,
      req.user,
    );
  }*/
}
