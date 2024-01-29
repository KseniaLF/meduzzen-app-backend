import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from '../entities';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, user } = context.switchToHttp().getRequest();

    const participant = await this.participantRepository.findOne({
      where: { id: params.id },
      relations: ['company.owner'],
    });
    if (!participant) throw new NotFoundException('Participant not found');

    const isOwner = participant.company?.owner?.email === user?.email;

    if (isOwner) return true;

    throw new ForbiddenException('You do not have permission to edit.');
  }
}
