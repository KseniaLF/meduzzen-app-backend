import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { Repository } from 'typeorm';
import { User, UserActions } from 'src/user/entities';
import { Invitation } from './entities';

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

  // ⚠️❌ there's no check to see if there's access to invitation
  //TODO : check it good enough ⚠️
  async sendInvitation(
    invitedUserEmail: string,
    companyId: string,
    ownerEmail: string,
  ) {
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
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    const isCompanyAlreadyInvited = invitedUser.invitations.some(
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
}
