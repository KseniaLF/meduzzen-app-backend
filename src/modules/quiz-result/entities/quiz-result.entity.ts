import { Company } from '../../company/entities';
import { Quizz } from '../../quizz/entities';
import { User } from '../../user/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class QuizResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correctAnswers: number;

  @ManyToOne(() => User, (user) => user.quizResults)
  user: User;

  @ManyToOne(() => Quizz, (quiz) => quiz.quizResults, {
    onDelete: 'CASCADE',
  })
  quiz: Quizz;

  @ManyToOne(() => Company, (company) => company.quizResults)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;
}
