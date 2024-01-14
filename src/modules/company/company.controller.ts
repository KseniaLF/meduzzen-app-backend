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
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/modules/company/guard/ownership.guard';
import { PaginationOptions, PaginationResult } from 'src/common/interfaces';
import { Company } from './entities';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';

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
  findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginationResult<Company>> {
    return this.companyService.findAll(query);
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

  @Patch(':id/visibility')
  @UseGuards(OwnershipGuard)
  @UsePipes(new ValidationPipe())
  updateVisibility(
    @Param('id') id: string,
    @Body() updateVisibilityDto: UpdateVisibilityDto,
  ) {
    return this.companyService.updateVisibility(id, updateVisibilityDto);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
