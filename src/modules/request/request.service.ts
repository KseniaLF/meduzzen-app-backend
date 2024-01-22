import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SendRequestParams } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities';
import { Repository } from 'typeorm';
// import { UserActions } from '../actions/entities';
import { ActionsService } from '../actions/actions.service';
// import { Company } from '../company/entities';
import { UserRequest } from './entities';
import { CompanyService } from '../company/company.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    // @InjectRepository(UserActions)
    // private readonly userActionsRepository: Repository<UserActions>,

    private actionsService: ActionsService,

    private companyService: CompanyService,

    // @InjectRepository(Company)
    // private readonly companyRepository: Repository<Company>,

    @InjectRepository(UserRequest)
    private readonly requestRepository: Repository<UserRequest>,
  ) {}

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

  async removeRequest(requestId: string) {
    await this.requestRepository.delete(requestId);
    return { message: 'Request successfully delete' };
  }

  async findAll() {
    const data = await this.requestRepository.find({
      relations: ['owner', 'company'],
    });
    return { data, message: `All request data` };
  }

  async findAllMy() {
    const data = await this.requestRepository.find({
      relations: ['owner', 'company'],
    });
    return { data, message: `All request data` };
  }

  async findOne(id: string) {
    const data = await this.requestRepository.findOne({
      where: { id },
      relations: ['owner', 'company'],
    });
    if (!data) throw new NotFoundException();
    return { data, message: `Request data` };
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }
}
