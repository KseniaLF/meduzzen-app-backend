import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserActions } from '../../../user/entities';
import { Company } from '../../company/entities';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class UserRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Content' })
  message: string;

  @Column({ default: RequestStatus.PENDING })
  status: RequestStatus;

  @ManyToOne(() => UserActions, (user) => user.companyRequests)
  owner: UserActions;

  @ManyToOne(() => Company, (company) => company.userRequests)
  company: Company;
}
