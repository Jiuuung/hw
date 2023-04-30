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
      request.role = checkUserRoleInSpace.auth;
      return true;
    }
    return false;
  }
}
