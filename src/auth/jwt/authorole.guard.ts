import { SpaceRepository } from '../../space/space.repository';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { PostRepository } from 'src/post/post.repository';
import { ChatRepository } from 'src/chat/chat.repository';

@Injectable()
export class UserRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly spaceRepository: SpaceRepository) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const sup = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user as { email: string };
    const space = request.params.spacename;
    if (!space) {
      throw new UnauthorizedException('no spacename in params');
    }
    const isInSpace = await this.spaceRepository.isUserInSpacePassId(
      user.email,
      space,
    );
    if (isInSpace) {
      const checkUserRoleInSpace =
        await this.spaceRepository.checkUserRoleInSpace(
          isInSpace.spaceId,
          isInSpace.userId,
        );
      request.spacename = space;
      request.role = checkUserRoleInSpace.auth;
      return true;
    }
    return false;
  }
}

@Injectable()
export class ChatUserRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly spaceRepository: SpaceRepository,
    private readonly postRepository: PostRepository,
    private readonly chatRepository: ChatRepository,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const sup = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user as { email: string };
    const space = request.params.spacename;
    const postId: number = +request.params.postid;
    const chatId: number = +request.params.chatid;
    if (!space) {
      throw new UnauthorizedException('no spacename in params');
    }
    if (!postId) {
      throw new UnauthorizedException('no postid in params');
    }
    const isInSpace = await this.spaceRepository.isUserInSpacePassId(
      user.email,
      space,
    );
    if (isInSpace) {
      const checkUserRoleInSpace =
        await this.spaceRepository.checkUserRoleInSpace(
          isInSpace.spaceId,
          isInSpace.userId,
        );
      request.role = checkUserRoleInSpace.auth;
      request.postId = postId;
      request.spacename = space;
      if (!chatId) {
        request.chatId = null;
      } else {
        if (await this.chatRepository.isChatExist(space, postId, chatId)) {
          request.chatId = chatId;
        } else {
          request.chatId = null;
        }
      }
      return await this.postRepository.isPostExist(postId, space);
    }

    return false;
  }
}
