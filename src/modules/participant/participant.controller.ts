import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { UpdateRoleDto } from '../company/dto/update-role.dto';

@Controller('participant')
@UseGuards(JwtAuthGuard)
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  @Get(':companyId')
  findAll(@Param('id') companyId: string) {
    return this.participantService.findAll(companyId);
  }

  // need ownerthip guard and check if participant is exist
  @Patch(':id/role')
  @UsePipes(new ValidationPipe())
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.participantService.updateRole({ id, ...updateRoleDto });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantService.findOne(id);
  }
}
