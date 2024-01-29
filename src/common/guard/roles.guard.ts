import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum';
import { ROLES_KEY } from '../decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/modules/company/entities';
import { CompanyNotFoundException } from '../filter';

// only lets in company administrators and the owner
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user, params } = context.switchToHttp().getRequest();

    const company = await this.companyRepository.findOne({
      where: { id: params.id }, // id - company id
      relations: ['owner', 'participants.user'],
    });
    if (!company) throw new CompanyNotFoundException();

    const isThisCompanyOwner = company.owner.email === user.email;
    if (isThisCompanyOwner) return true;

    const companyParticipant = company.participants.find(
      (participant) => participant.user.email === user.email,
    );
    if (!companyParticipant) return false;

    return requiredRoles.some(
      (role) => companyParticipant.role?.includes(role),
    );
  }
}
