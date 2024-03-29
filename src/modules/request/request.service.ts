import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SendRequestParams } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionsService } from '../actions/actions.service';
import { UserRequest } from './entities';
import { CompanyService } from '../company/company.service';
import { RequestNotFoundException } from 'src/common/filter';
import { ParticipantService } from '../participant/participant.service';
import { RequestStatus } from 'src/common/enum';

@Injectable()
export class RequestService {
  constructor(
    private actionsService: ActionsService,

    private companyService: CompanyService,

    private participantService: ParticipantService,

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

  // if already accepted, owner can delete the request
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

  async acceptRequest(id: string) {
    const request = await this.requestRepository.findOne({
      relations: ['owner', 'company'],
      where: { id },
    });

    const data = await this.participantService.create({
      email: request.owner.email,
      companyId: request.company.id,
    });

    await this.requestRepository.update(id, {
      status: RequestStatus.ACCEPTED,
    });

    return { data, message: 'Success accepted' };
  }

  async rejectRequest(invitationId: string) {
    await this.requestRepository.update(invitationId, {
      status: RequestStatus.REJECTED,
    });

    return { message: 'Success rejected' };
  }
}
