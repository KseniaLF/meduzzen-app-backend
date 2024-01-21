import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActions } from './entities';
import { User } from '../user/entities';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(UserActions)
    private readonly userActionsRepository: Repository<UserActions>,
  ) {}

  async getUsersActivity() {
    const data = await this.userActionsRepository.find({
      relations: [
        'user',
        'companyParticipations',
        'invitations',
        'companyRequests',
      ],
    });
    return data;
  }

  async getUserAction(email: string) {
    let userAction = await this.userActionsRepository.findOne({
      relations: [
        'user',
        'invitations',
        'invitations.company',
        'companyRequests.company',
      ],
      where: { user: { email } },
    });

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw new NotFoundException();

    if (!userAction) {
      userAction = await this.userActionsRepository.save({ user });
    }

    return { userAction, user };
  }

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
}
