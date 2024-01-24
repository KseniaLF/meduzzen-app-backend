import { User } from '../../user/entities';
import { Invitation } from '../../invitation/entities';
import { UserActions } from '../../actions/entities';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRequest } from '../../request/entities';

export enum Status {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

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
  @ManyToMany(() => UserActions, (user) => user.companyParticipations)
  participants: UserActions[];

  // @ManyToMany(() => UserActions, (user) => user.companyInvitations)
  // userInvitations: UserActions[];

  // users to whom this company has sent an invitation to join
  @OneToMany(() => Invitation, (invitation) => invitation.company)
  invitations: Invitation[];
  // This is not correst... ❌❌❌ 🔻🔺🔼🔽
  // IS this already CORRECT??? 🎃❌
  // users who have sent a joining request to this company
  @OneToMany(() => UserRequest, (request) => request.company)
  userRequests: UserRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

//  TODO: userRequests not work so good as invitations. ✅?
// to do routes:
//  QUIT company.
// delete patricipant from my company
