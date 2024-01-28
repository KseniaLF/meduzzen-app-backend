// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// @Injectable()
// export class EditPermissionGuard implements CanActivate {
//   constructor(
//     @InjectRepository(Invitation)
//     private readonly invitationRepository: Repository<Invitation>,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const invitation = await this.invitationRepository.findOne({
//       where: { id: request.params.id },
//       relations: ['owner'],
//     });
//     if (!invitation) throw new NotFoundException('Invitation not found');

//     const isEditAccess = invitation.owner.email === request.user.email;

//     if (isEditAccess) return true;

//     throw new ForbiddenException('You do not have permission to edit.');
//   }
// }
