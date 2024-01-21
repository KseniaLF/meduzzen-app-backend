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
import { UserActions } from '../actions/entities';
import { ActionsService } from '../actions/actions.service';
import { Company } from '../company/entities';
import { UserRequest } from './entities';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(UserActions)
    private readonly userActionsRepository: Repository<UserActions>,

    private actionsService: ActionsService,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(UserRequest)
    private readonly requestRepository: Repository<UserRequest>,
  ) {}

  async sendRequest({ companyId, userEmail, message }: SendRequestParams) {
    const { userAction, user } =
      await this.actionsService.getUserAction(userEmail);

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner'],
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
    if (company.owner.email === userEmail)
      throw new BadRequestException('You are owner of this company');

    const isRequestAlreadySent = userAction?.companyRequests?.some(
      (request) => request.company.id === company.id,
    );

    if (isRequestAlreadySent) {
      return {
        message: `You has already sent the request to the company ${company.name}.`,
      };
    }

    const data = await this.requestRepository.save({
      user,
      company,
      message,
    });

    return {
      message: `You successfully sent the request to the company ${company.name}.`,
      data,
    };
  }

  findAll() {
    return `This action returns all request`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
