import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities';
import {
  CompanyNotFoundException,
  UserNotFoundException,
} from 'src/common/filter';
import { Company } from '../company/entities';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const user = await this.userRepository.findOne({
      where: { email: createParticipantDto.email },
    });
    if (!user) throw new UserNotFoundException();

    const company = await this.companyRepository.findOne({
      relations: ['participants'],
      where: { id: createParticipantDto.companyId },
    });
    if (!company) throw new CompanyNotFoundException();

    const participant = await this.participantRepository.save({
      user,
      company,
    });

    return participant;
  }

  findAll() {
    return `This action returns all participant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
