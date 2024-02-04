import { Module } from '@nestjs/common';
import { QuizResultController } from './quiz-result.controller';
import { imports, providers } from 'src/common/constants/module.const';

@Module({
  imports,
  controllers: [QuizResultController],
  providers,
})
export class QuizResultModule {}
