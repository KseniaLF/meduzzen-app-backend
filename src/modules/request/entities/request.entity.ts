import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../company/entities';
import { UserActions } from '../../actions/entities';
import { RequestStatus } from '../../../common/enum';

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
