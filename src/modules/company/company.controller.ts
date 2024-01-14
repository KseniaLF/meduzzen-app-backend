import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/modules/company/guard/ownership.guard';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createCompany(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    return this.companyService.create(createCompanyDto, req.user.email);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
