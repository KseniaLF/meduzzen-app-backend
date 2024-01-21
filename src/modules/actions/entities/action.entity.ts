import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invitation } from '../../invitation/entities';
import { Company } from '../../company/entities';
import { User } from '../../../user/entities';
import { UserRequest } from '../../request/entities';

@Entity()
export class UserActions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.actions, { onDelete: 'CASCADE' })
  user: User;

  // my companies
  //   @OneToMany(() => Company, (company) => company.owner)
  //   companies: Company[];

  // companies where I am a participant
  @ManyToMany(() => Company, (company) => company.participants)
  @JoinTable()
  companyParticipations: Company[];

  //  TODO: this is not usable, delete it ❌
  // @ManyToMany(() => Company, (company) => company.userInvitations)
  // @JoinTable()
  // companyInvitations: Company[];

  // companies that have sent the user an invitations to join
  @OneToMany(() => Invitation, (invitation) => invitation.user)
  invitations: Invitation[];

  // companies to which this user has sent a request to join
  @OneToMany(() => UserRequest, (request) => request.owner)
  companyRequests: UserRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
