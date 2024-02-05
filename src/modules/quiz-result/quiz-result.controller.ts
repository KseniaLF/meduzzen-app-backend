import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { QuizResultService } from './quiz-result.service';
import {
  CreateQuizResultDto,
  UserAnswerDTO,
} from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('quiz-result')
@UseGuards(JwtAuthGuard)
export class QuizResultController {
  constructor(private readonly quizResultService: QuizResultService) {}

  @Post(':id')
  @UsePipes(new ValidationPipe())
  create(
    @Param('id') id: string,
    @Request() req,
    @Body() createQuizResultDto: CreateQuizResultDto,
  ) {
    const params = {
      email: req.user.email,
      quizId: id,
      ...createQuizResultDto,
    };
    return this.quizResultService.create(params);
  }

  @Post('res/:id')
  @UsePipes(new ValidationPipe())
  sendAnswer(
    @Param('id') id: string,
    @Request() req,
    @Body() answers: UserAnswerDTO[],
  ) {
    const params = {
      email: req.user.email,
      quizId: id,
      answers,
    };
    return this.quizResultService.sendAnswer(params);
  }

  @Get()
  findAll() {
    return this.quizResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizResultService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuizResultDto: UpdateQuizResultDto,
  ) {
    return this.quizResultService.update(+id, updateQuizResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizResultService.remove(+id);
  }
}
