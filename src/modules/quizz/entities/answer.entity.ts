import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  answerText: string;

  @Column({ default: false })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: Question;
}
