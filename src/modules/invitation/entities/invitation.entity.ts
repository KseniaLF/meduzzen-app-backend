import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User, UserActions } from '../../../user/entities';
import { Company } from '../../company/entities';

enum Status {
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

  @Column({ default: Status.PENDING })
  status: Status;

  @ManyToOne(() => UserActions, (user) => user.invitations)
  user: UserActions;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Company, (company) => company.invitations)
  company: Company;
}
