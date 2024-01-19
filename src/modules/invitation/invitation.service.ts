import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities';
import { Repository } from 'typeorm';
import { User, UserActions } from 'src/user/entities';
import { Invitation } from './entities';
import { SendInvitationParams } from './dto/create-invitation.dto';

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
    if (company.owner.email !== ownerEmail)
      throw new ForbiddenException('No access');

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

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

  async getUsersActivity() {
    const data = await this.userActionsRepository.find({
      relations: [
        'user',
        'companyParticipations',
        'companyInvitations',
        'invitations',
        'companyRequests',
      ],
    });
    return data;
  }

  async acceptInvitation(invitationId: string, email: string) {
    const invitation = await this.invitationRepository.findOne({
      relations: ['user.user', 'company'],
      where: { id: invitationId, user: { user: { email } } },
    });
    if (!invitation) throw new NotFoundException('Invitation not found');
    console.log(invitation);

    const currentCompany = await this.companyRepository.findOne({
      relations: ['participants'],
      where: { id: invitation.company.id },
    });
    if (!currentCompany) throw new NotFoundException();

    console.log(currentCompany);

    console.log(3);

    // Обновляем список участников
    currentCompany.participants = [
      ...currentCompany.participants,
      invitation.user,
    ];
    console.log(2);
    // Сохраняем изменения в базе данных
    await this.companyRepository.save(currentCompany);

    console.log('Значение обновлено успешно');

    return currentCompany;
  }
}
