import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async findAll() {
    const companies = await this.companyRepository.find({});
    return companies;
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

  async remove(id: string) {
    await this.companyRepository.delete(id);
    return { message: 'Company deleted successfully' };
  }
}