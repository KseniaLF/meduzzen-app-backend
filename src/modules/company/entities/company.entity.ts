import { User } from '../../user/entities';
import { Invitation } from '../../invitation/entities';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRequest } from '../../request/entities';
import { Participant } from '../../participant/entities/participant.entity';
import { Status } from '../../../common/enum';
import { Quizz } from '../../quizz/entities';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PUBLIC,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.companies, {
    onDelete: 'CASCADE',
  })
  owner: User;

  // whose users are accepted into the company
  @OneToMany(() => Participant, (participant) => participant.company)
  participants: Participant[];

  // users to whom this company has sent an invitation to join
  @OneToMany(() => Invitation, (invitation) => invitation.company)
  invitations: Invitation[];

  // users who have sent a joining request to this company
  @OneToMany(() => UserRequest, (request) => request.company)
  userRequests: UserRequest[];

  @OneToMany(() => Quizz, (quizz) => quizz.company)
  quizzes: Quizz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
