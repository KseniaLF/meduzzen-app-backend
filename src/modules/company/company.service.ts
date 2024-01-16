import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities';
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
    const allInvitationsForMe = await this.userActionsRepository.findOne({
      relations: ['companyInvitations'],
      where: { user: { email } },
    });
    return allInvitationsForMe.companyInvitations;
  }

  async sendInvitation(
    // ownerEmail: string,
    invitedUserEmail: string,
    companyId: string,
  ) {
    // const invitedUser = await this.userRepository.findOne({
    //   where: { email: invitedUserEmail },
    // });

    // // Сохраняем объект UserActions в базу данных
    // return this.userActionsRepository.save({ user: invitedUser });

    const invitedUser = await this.userActionsRepository.findOne({
      relations: ['user', 'companyInvitations'],
      where: { user: { email: invitedUserEmail } },
    });
    console.log(invitedUser);

    if (!invitedUser) console.log('invitedUser');

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    const isCompanyAlreadyInvited = invitedUser.companyInvitations.some(
      (invitedCompany) => invitedCompany.id === company.id,
    );

    if (!isCompanyAlreadyInvited) {
      invitedUser.companyInvitations = [
        ...invitedUser.companyInvitations,
        company,
      ];
      const data = await this.userActionsRepository.save(invitedUser);
      return {
        message: `The company with identifier ${companyId} successfully invited the user ${invitedUserEmail}`,
        data,
      };
    }

    return {
      message: `Company with ID ${companyId} is already invited to the user.`,
    };
  }

  async deleteInvitation(invitedUserEmail: string, companyId = '20') {
    const invitedUser = await this.userActionsRepository.findOne({
      relations: ['user', 'companyInvitations'],
      where: {
        user: { email: invitedUserEmail },
        companyInvitations: { id: companyId },
      },
    });
    if (!invitedUser) throw new NotFoundException('Invitation not found');

    invitedUser.companyInvitations = invitedUser.companyInvitations.filter(
      (company) => company.id != companyId,
    );
    await this.userActionsRepository.save(invitedUser);

    return { message: 'Invitation successfully delete' };
  }
}
