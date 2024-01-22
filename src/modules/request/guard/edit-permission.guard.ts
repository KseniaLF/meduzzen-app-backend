import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequest } from '../entities';

@Injectable()
export class EditPermissionGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRequest)
    private readonly requestRepository: Repository<UserRequest>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userRequest = await this.requestRepository.findOne({
      where: { id: request.params.id },
      relations: ['owner.user'],
    });

    if (!userRequest) throw new NotFoundException('Invitation not found');

    const isEditAccess = userRequest.owner.user.email === request.user.email;

    if (isEditAccess) return true;

    throw new ForbiddenException('You do not have permission to edit.');
  }
}
