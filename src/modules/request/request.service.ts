import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SendRequestParams } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities';
import { Repository } from 'typeorm';
import { ActionsService } from '../actions/actions.service';
import { RequestStatus, UserRequest } from './entities';
import { CompanyService } from '../company/company.service';
import {
  CompanyNotFoundException,
  RequestNotFoundException,
} from 'src/common/filter';
import { Company } from '../company/entities';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    // @InjectRepository(UserActions)
    // private readonly userActionsRepository: Repository<UserActions>,

    private actionsService: ActionsService,

    private companyService: CompanyService,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(UserRequest)
    private readonly requestRepository: Repository<UserRequest>,
  ) {}

  // BUT You are already participant this company??? ❌
  async sendRequest({ companyId, userEmail, message }: SendRequestParams) {
    const { userAction } = await this.actionsService.getUserAction(userEmail);
    const company = await this.companyService.findOne(companyId);

    if (company.owner.email === userEmail)
      throw new BadRequestException('You are owner of this company');

    const isRequestAlreadySent = userAction?.companyRequests?.some(
      (request) => request.company.id === company.id,
    );

    if (isRequestAlreadySent) {
      const message = `You has already sent the request to the company ${company.name}.`;
      return { message };
    }

    const data = await this.requestRepository.save({
      owner: userAction,
      company,
      message,
    });

    return {
      message: `You successfully sent the request to the company ${company.name}.`,
      data,
    };
  }

  // if already accepted, owner cant delete the request? or no?
  // now owner can delete the request
  async removeRequest(requestId: string) {
    await this.requestRepository.delete(requestId);
    return { message: 'Request successfully delete' };
  }

  async findAllMy(email: string) {
    const data = await this.requestRepository.find({
      where: { owner: { email } },
      relations: ['owner', 'company'],
    });
    return { data, message: `All my requests` };
  }

  // FOR TESTING ONLY
  async findAll() {
    const data = await this.requestRepository.find({
      relations: ['owner', 'company'],
    });
    return { data, message: `All requests` };
  }

  // Need Read-Permission Guard
  async findOne(id: string) {
    const data = await this.requestRepository.findOne({
      where: { id },
      relations: ['owner', 'company'],
    });

    if (!data) throw new RequestNotFoundException();
    return { data, message: `Request data` };
  }

  async updateMessage(id: string, updateRequestDto: UpdateRequestDto) {
    const request = await this.requestRepository.findOne({
      where: { id },
    });
    if (!request) throw new RequestNotFoundException();

    await this.requestRepository.update(id, {
      message: updateRequestDto.message,
    });
    return { message: 'Message updated successfully' };
  }

  // ---

  async acceptRequest(id: string) {
    const request = await this.requestRepository.findOne({
      relations: ['owner', 'company'],
      where: { id },
    });

    const currentCompany = await this.companyRepository.findOne({
      relations: ['participants'],
      where: { id: request.company.id },
    });
    if (!currentCompany) throw new CompanyNotFoundException();

    currentCompany.participants = [
      ...currentCompany.participants,
      request.owner,
    ];
    await this.companyRepository.save(currentCompany);

    await this.requestRepository.update(id, {
      status: RequestStatus.ACCEPTED,
    });

    return { currentCompany, message: 'Success accepted' };
  }

  async rejectRequest(invitationId: string) {
    await this.requestRepository.update(invitationId, {
      status: RequestStatus.REJECTED,
    });

    return { message: 'Success rejected' };
  }
}
