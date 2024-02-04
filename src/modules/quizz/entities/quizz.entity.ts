import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities';
import { Question } from './question.entity';
import { Company } from '../../company/entities';
import { QuizResult } from '../../quiz-result/entities';

@Entity()
export class Quizz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  frequencyDays: number;

  @OneToMany(() => Question, (question) => question.quizz, { cascade: true })
  questions: Question[];

  @OneToMany(() => QuizResult, (quizRes) => quizRes.quiz, { cascade: true })
  quizResults: QuizResult[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => Company, (company) => company.quizzes)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
