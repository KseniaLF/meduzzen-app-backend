import { User } from '../../../user/entities';
import { UserActions } from '../../../user/entities/company-actions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  PRIVATE = 'private',
  PUBLIC = 'inactive',
}

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
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
  @ManyToMany(() => UserActions, (user) => user.companyParticipations)
  participants: UserActions[];

  // users to whom this company has sent an invitation to join
  @ManyToMany(() => UserActions, (user) => user.companyInvitations)
  userInvitations: UserActions[];

  // users who have sent a joining request to this company
  @ManyToMany(() => UserActions, (user) => user.companyRequests)
  userRequests: UserActions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
