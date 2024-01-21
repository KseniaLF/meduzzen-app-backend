import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user/entities';
import { Company } from '../../company/entities';
import { UserActions } from '../../actions/entities';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Content' })
  message: string;

  @Column({ default: InvitationStatus.PENDING })
  status: InvitationStatus;

  @ManyToOne(() => UserActions, (user) => user.invitations)
  user: UserActions;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Company, (company) => company.invitations)
  company: Company;
}
