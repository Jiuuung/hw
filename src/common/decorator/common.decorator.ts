import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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

export const AuthRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auth = request.auth;
    return auth;
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
