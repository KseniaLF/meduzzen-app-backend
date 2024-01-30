import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AnswerDto } from './create-quizz.dto';

@ValidatorConstraint({ name: 'isOneCorrectAnswer', async: false })
export class IsOneCorrectAnswer implements ValidatorConstraintInterface {
  validate(answers: AnswerDto[]) {
    const correctAnswers = answers.filter((answer) => answer.isCorrect);
    if (correctAnswers.length === 1) return true;
  }

  defaultMessage() {
    return 'Only one answer should be marked as correct';
  }
}
