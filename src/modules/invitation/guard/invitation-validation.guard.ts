import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from '../entities';

@Injectable()
export class InvitationValidationGuard implements CanActivate {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.user.email;

    const { inviteId } = request.params;

    const invitation = await this.invitationRepository.findOne({
      relations: ['user.user', 'company'],
      where: { id: inviteId, user: { user: { email } } },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(
        `You've already ${invitation.status} the invitation`,
      );
    }

    return true;
  }
}
