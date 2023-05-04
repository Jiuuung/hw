import { ChangeRoleDto } from './../../space/dto/space.changerole.dto';
import { PostRepository } from './../../post/post.repository';
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
import { Auth } from '@prisma/client';
import { ChatRepository } from 'src/chat/chat.repository';

@Injectable()
export class PostChatGuard extends AuthGuard('jwt') implements CanActivate {
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

@Injectable()
export class ChatEditDeleteGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
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
    if (!chatId) {
      throw new UnauthorizedException('no chatid in params');
    }
    const isInSpace = await this.spaceRepository.isUserInSpacePassId(
      user.email,
      space,
    );
    if (isInSpace) {
      if (await this.postRepository.isPostExist(postId, space)) {
        if (await this.chatRepository.isChatExist(space, postId, chatId)) {
          const checkUserRoleInSpace =
            await this.spaceRepository.checkUserRoleInSpace(
              isInSpace.spaceId,
              isInSpace.userId,
            );
          request.chatId = chatId;
          request.postId = postId;
          request.spacename = space;
          const isAuthor = await this.chatRepository.isChatAuthor(
            postId,
            chatId,
            user.email,
          );
          if (checkUserRoleInSpace.auth === Auth.ADMIN || isAuthor === true) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    return false;
  }
}
