import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator';
import { Role } from 'src/common/enum';

@Controller('quizz')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createQuizzDto: CreateQuizzDto) {
    return this.quizzService.create(createQuizzDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.quizzService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizzDto: UpdateQuizzDto) {
    return this.quizzService.update(+id, updateQuizzDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzService.remove(+id);
  }
}
