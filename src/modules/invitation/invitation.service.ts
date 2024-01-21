import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities';
import { Invitation, InvitationStatus } from './entities';
import { SendInvitationParams } from './dto/create-invitation.dto';
import { UserActions } from '../actions/entities';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(UserActions)
    private readonly userActionsRepository: Repository<UserActions>,

    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async getInvitationsForMe(email: string) {
    const allInvitationsForMe = await this.invitationRepository.find({
      relations: ['company', 'owner'],
      where: { user: { user: { email } } },
    });
    return allInvitationsForMe;
  }

  // only for testing, delete later ⚠️❌
  async getAllInvitations() {
    const allInvitation = await this.invitationRepository.find({
      relations: ['user.user', 'company', 'owner'],
    });
    return allInvitation;
  }

  //  invitations i send to users to join my companies
  async getAllMyInvitations(email: string) {
    const allInvitation = await this.invitationRepository.find({
      // 'user' - this is user to whom I send invitation to join my company
      relations: ['user.user', 'company', 'owner'],
      where: { owner: { email } },
    });
    return allInvitation;
  }

  async getInvitationById(id: string) {
    const invitation = await this.invitationRepository.findOne({
      relations: ['user.user', 'company', 'owner'],
      where: { id },
    });
    return invitation;
  }

  async sendInvitation({
    invitedUserEmail,
    companyId,
    ownerEmail,
    message,
  }: SendInvitationParams) {
    let invitedUser = await this.userActionsRepository.findOne({
      relations: ['user', 'invitations', 'invitations.company'],
      where: { user: { email: invitedUserEmail } },
    });

    if (!invitedUser) {
      const user = await this.userRepository.findOne({
        where: { email: invitedUserEmail },
      });
      if (!user) throw new NotFoundException();
      invitedUser = await this.userActionsRepository.save({ user });
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner'],
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
    if (company.owner.email !== ownerEmail)
      throw new ForbiddenException('No access');

    const isCompanyAlreadyInvited = invitedUser?.invitations?.some(
      (invitation) => invitation.company.id === company.id,
    );

    if (!isCompanyAlreadyInvited) {
      const owner = await this.userRepository.findOne({
        where: { email: ownerEmail },
      });
      if (!owner) throw new NotFoundException();

      const data = await this.invitationRepository.save({
        user: invitedUser,
        company,
        owner,
        message,
      });

      return {
        message: `Company ${company.name} successfully invited the user ${invitedUserEmail}.`,
        data,
      };
    }

    return {
      message: `Company ${company.name} is already invited to the user ${invitedUserEmail}.`,
    };
  }

  async deleteInvitation(invitationId: string) {
    await this.invitationRepository.delete(invitationId);
    return { message: 'Invitation successfully delete' };
  }

  // ---------- USERS ----------------

  async acceptInvitation(invitationId: string) {
    const invitation = await this.invitationRepository.findOne({
      relations: ['user', 'company'],
      where: { id: invitationId },
    });

    const currentCompany = await this.companyRepository.findOne({
      relations: ['participants'],
      where: { id: invitation.company.id },
    });
    if (!currentCompany) throw new NotFoundException();

    currentCompany.participants = [
      ...currentCompany.participants,
      invitation.user,
    ];
    await this.companyRepository.save(currentCompany);

    await this.invitationRepository.update(invitationId, {
      status: InvitationStatus.ACCEPTED,
    });

    return { currentCompany };
  }

  async rejectInvitation(invitationId: string) {
    await this.invitationRepository.update(invitationId, {
      status: InvitationStatus.REJECTED,
    });

    return { message: 'Success rejected' };
  }
}
