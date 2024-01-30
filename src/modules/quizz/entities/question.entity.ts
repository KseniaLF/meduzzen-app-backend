import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quizz } from './quizz.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quizz, (company) => company.questions)
  quizz: Quizz;

  @Column()
  question: string;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
