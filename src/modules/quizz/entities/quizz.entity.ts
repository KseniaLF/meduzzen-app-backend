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

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => Question, (question) => question.quizz, { cascade: true })
  questions: Question[];

  @ManyToOne(() => Company, (company) => company.quizzes)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
