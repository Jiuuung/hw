import { AdminPostDto } from '../../post/dto/post.admin.dto';
import { PostDto } from '../../post/dto/post.user.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from '@prisma/client';

export const UserAdminDisting = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const role = request.role;
    const body = request.body;
    body.auth = role;
    return body;
  },
);

export const UserRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);

export const Chat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;
    body.chatId = request.chatId;
    body.spacename = request.spacename;
    body.postId = request.postId;
    return body;
  },
);

export const ChatUserAdminDisting = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const role = request.role;
    const body = request.body;
    body.auth = role;
    body.spacename = request.spacename;
    body.postId = request.postId;
    return body;
  },
);
