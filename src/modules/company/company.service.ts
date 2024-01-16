import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { Company, Invitation } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions, PaginationResult } from 'src/common/interfaces';
import { PaginationService } from 'src/common/service/pagination.service';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { User } from '../../user/entities/user.entity';
import { UserActions } from 'src/user/entities/company-actions.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly paginationService: PaginationService,

    @InjectRepository(UserActions)
    private readonly userActionsRepository: Repository<UserActions>,

    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const company = await this.companyRepository.save({
      name: createCompanyDto.name,
      description: createCompanyDto.description,
      owner: user,
    });

    return company;
  }

  async findAll(
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<Company>> {
    return this.paginationService.findAll(
      this.companyRepository,
      paginationOptions,
    );
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException();
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(id, {
      name: updateCompanyDto.name,
      description: updateCompanyDto.description,
    });

    return { message: 'Company data updated successfully' };
  }

  async updateVisibility(id: string, updateStatus: UpdateVisibilityDto) {
    await this.companyRepository.update(id, {
      status: updateStatus.status,
    });

    return { message: 'Company visibility updated successfully' };
  }

  async remove(id: string) {
    await this.companyRepository.delete(id);
    return { message: 'Company deleted successfully' };
  }

  // ---------

  async getInvitationsForMe(email: string) {
    const allInvitationsForMe = await this.invitationRepository.find({
      relations: ['user'],
      // where: { user: { email } },
    });
    console.log(allInvitationsForMe);
    return allInvitationsForMe;
  }

  async sendInvitation(
    // ownerEmail: string,
    invitedUserEmail: string,
    companyId: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { email: invitedUserEmail },
    });

    let invitedUser = await this.userActionsRepository.findOne({
      relations: ['user', 'invitations', 'invitations.company'],
      where: { user: { email: invitedUserEmail } },
    });
    console.log(invitedUser);
    if (!invitedUser) {
      invitedUser = await this.userActionsRepository.save({ user });
      console.log(invitedUser);
    }

    // // Сохраняем объект UserActions в базу данных
    // return this.userActionsRepository.save({ user: invitedUser });

    // const invitedUser = await this.userRepository.findOne({
    //   where: { email: invitedUserEmail },
    // });
    // console.log(invitedUser);
    // return invitedUser;

    // const invitedUser = await this.userActionsRepository.findOne({
    //   relations: ['user', 'companyInvitations'],

    //   // where: { user: { email: invitedUserEmail } },
    // });
    // console.log(invitedUser);
    // return 2;
    if (!invitedUser) {
      throw new NotFoundException(`User with email ${invitedUser} not found`);
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
      const data = await this.invitationRepository.save({
        user: invitedUser,
        company,
      });

      return {
        message: `The company with identifier ${companyId} successfully invited the user ${invitedUserEmail}`,
        data,
      };
    }

    return {
      message: `Company with ID ${companyId} is already invited to the user.`,
    };
  }

  async deleteInvitation(invitationId: string) {
    const invitationForMeById = await this.invitationRepository.findOne({
      where: { id: invitationId },
    });
    if (!invitationForMeById)
      throw new NotFoundException('Invitation not found');

    await this.invitationRepository.delete(invitationId);
    return { message: 'Invitation successfully delete' };
  }
}
