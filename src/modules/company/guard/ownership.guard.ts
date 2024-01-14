import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const company = await this.companyRepository.findOne({
      where: { id: request.params.id },
      relations: ['owner'],
      select: ['owner', 'id'],
    });

    if (!company) throw new NotFoundException();

    const user = request.user;

    return user && user.email === company.owner.email;
  }
}
