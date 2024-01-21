import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActions } from './entities';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(UserActions)
    private readonly userActionsRepository: Repository<UserActions>,
  ) {}

  create(createActionDto: CreateActionDto) {
    return 'This action adds a new action';
  }

  findAll() {
    return `This action returns all actions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} action`;
  }

  update(id: number, updateActionDto: UpdateActionDto) {
    return `This action updates a #${id} action`;
  }

  remove(id: number) {
    return `This action removes a #${id} action`;
  }

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
}
