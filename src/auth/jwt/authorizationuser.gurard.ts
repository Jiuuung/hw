import { SpaceRepository } from '../../space/space.repository';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthorizationUserGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  constructor(private readonly spaceRepository: SpaceRepository) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const sup = await super.canActivate(context);
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { email: string };
    const space = request.params.spacename;
    if (!space) {
      throw new UnauthorizedException('no spacename in params');
    }
    const isInSpace = await this.spaceRepository.isUserInSpace(
      user.email,
      space,
    );
    if (isInSpace) {
      return true;
    }
    return false;
  }
}
