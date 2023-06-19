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

@Injectable()
export class PostDeleteGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly spaceRepository: SpaceRepository,
    private readonly postRepository: PostRepository,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const sup = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user as { email: string };
    const space = request.params.spacename;
    const postId = parseInt(request.params.postid);
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
      const isAuthor = await this.postRepository.isPostAuthor(
        postId,
        user.email,
      );
      if (checkUserRoleInSpace.auth === Auth.ADMIN || isAuthor === true) {
        request.auth = checkUserRoleInSpace.auth;
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
