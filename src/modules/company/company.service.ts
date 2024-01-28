import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions, PaginationResult } from 'src/common/interfaces';
import { PaginationService } from 'src/common/service/pagination.service';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { User } from '../user/entities/user.entity';
import { Invitation } from '../invitation/entities';
import { UserActions } from '../actions/entities';
import { CompanyNotFoundException } from 'src/common/filter';
import { EmailDto } from './dto/delete-user.dto';

const COMPANY_RELATIONS = [
  'owner',
  'participants',
  'invitations',
  'invitations.user',
  'userRequests.owner',
];

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

  async findMyCompany(email: string) {
    const data = await this.companyRepository.find({
      where: { owner: { email } },
      relations: COMPANY_RELATIONS,
    });
    return data;
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: COMPANY_RELATIONS,
    });
    if (!company) throw new CompanyNotFoundException();
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

  async removeUser(id: string, { email }: EmailDto) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    company.participants = company.participants.filter(
      (participant) => participant.email !== email,
    );

    const updatedCompany = await this.companyRepository.save(company);
    return updatedCompany;
  }

  async findInvitations(id: string) {
    const data = await this.companyRepository.findOne({
      where: { id },
      relations: ['invitations.user.user'],
    });
    return data.invitations;
  }

  async findRequests(id: string) {
    const data = await this.companyRepository.findOne({
      where: { id },
      relations: ['userRequests.owner.user'],
    });
    return data.userRequests;
  }

  async findParticipants(id: string) {
    const data = await this.companyRepository.findOne({
      where: { id },
      relations: ['participants.user'],
    });
    if (!data) throw new CompanyNotFoundException();
    return data.participants;
  }
}
