import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from './entities';
import { SendInvitationParams } from './dto/create-invitation.dto';
import { ActionsService } from '../actions/actions.service';
import { CompanyNotFoundException } from 'src/common/filter';
import { ParticipantService } from '../participant/participant.service';
import { UserService } from '../user/user.service';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    private userService: UserService,

    private actionsService: ActionsService,

    private participantService: ParticipantService,
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

  async sendInvitation(sendInvitationParams: SendInvitationParams) {
    const { invitedUserEmail, companyId, ownerEmail, message } =
      sendInvitationParams;

    const { userAction } =
      await this.actionsService.getUserAction(invitedUserEmail);

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner'],
    });
    if (!company) throw new CompanyNotFoundException();

    const isCompanyAlreadyInvited = userAction?.invitations?.some(
      (invitation) => invitation.company.id === company.id,
    );

    if (!isCompanyAlreadyInvited) {
      const owner = await this.userService.findUserByEmail(ownerEmail);

      const data = await this.invitationRepository.save({
        user: userAction,
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

    const data = await this.participantService.create({
      email: invitation.user.email,
      companyId: invitation.company.id,
    });

    await this.invitationRepository.update(invitationId, {
      status: InvitationStatus.ACCEPTED,
    });

    return { data, message: 'Success accepted' };
  }

  async rejectInvitation(invitationId: string) {
    await this.invitationRepository.update(invitationId, {
      status: InvitationStatus.REJECTED,
    });

    return { message: 'Success rejected' };
  }
}
