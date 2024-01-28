import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStatus, UserRequest } from '../entities';
import { RequestNotFoundException } from 'src/common/filter';

@Injectable()
export class RequestValidationGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRequest)
    private readonly requestRepository: Repository<UserRequest>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.user.email;

    const { id } = request.params;

    const invitation = await this.requestRepository.findOne({
      relations: ['owner', 'company.owner'],
      where: { id, company: { owner: { email } } },
    });

    if (!invitation) throw new RequestNotFoundException();

    if (invitation.status !== RequestStatus.PENDING) {
      throw new BadRequestException(
        `You've already ${invitation.status} the request`,
      );
    }

    return true;
  }
}
