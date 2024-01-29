import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities';
import {
  CompanyNotFoundException,
  UserNotFoundException,
} from 'src/common/filter';
import { Company } from '../company/entities';
import { UpdateRoleDataDto } from '../company/dto/update-role.dto';

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

  async findAll() {
    const data = await this.participantRepository.find({
      relations: ['company', 'user'],
    });
    return data;
  }

  async findOne(id: string) {
    const participant = await this.participantRepository.findOne({
      where: { id },
    });
    if (!participant) throw new NotFoundException();
    return participant;
  }

  async updateRole(updateRole: UpdateRoleDataDto) {
    const { id, role } = updateRole;
    await this.participantRepository.update(id, { role });
    return 'Role updated successfully';
  }
}
