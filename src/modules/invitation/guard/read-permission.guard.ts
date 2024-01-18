import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from '../entities';

@Injectable()
export class ReadPermissionGuard implements CanActivate {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const invitation = await this.invitationRepository.findOne({
      where: { id: request.params.id },
      relations: ['owner', 'user.user'],
    });
    if (!invitation) throw new NotFoundException('Invitation not found');

    const isOwner = invitation.owner.email === request.user.email;
    const isInvitedUser = invitation.user.user.email === request.user.email;

    if (isOwner || isInvitedUser) return true;

    throw new ForbiddenException();
  }
}
