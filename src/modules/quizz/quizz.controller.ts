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

  @Post(':id')
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe())
  create(
    @Body() createQuizzDto: CreateQuizzDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    const params = {
      ownerEmail: req.user.email,
      companyId: id,
      ...createQuizzDto,
    };
    return this.quizzService.create(params);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.quizzService.findAll(id);
  }

  @Get(':quizzId')
  findOne(@Param('quizzId') quizzId: string) {
    return this.quizzService.findOne(quizzId);
  }

  @Patch(':id/:quizzId')
  @Roles(Role.Admin)
  update(
    @Param('quizzId') quizzId: string,
    @Body() updateQuizzDto: UpdateQuizzDto,
  ) {
    return this.quizzService.update(quizzId, updateQuizzDto);
  }

  @Delete(':id/:quizzId')
  @Roles(Role.Admin)
  remove(@Param('quizzId') quizzId: string) {
    return this.quizzService.remove(quizzId);
  }
}
