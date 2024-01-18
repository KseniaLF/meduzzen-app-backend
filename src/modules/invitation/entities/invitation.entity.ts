import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User, UserActions } from '../../../user/entities';
import { Company } from '../../company/entities';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Content' })
  message: string;

  @ManyToOne(() => UserActions, (user) => user.invitations)
  user: UserActions;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Company, (company) => company.invitations)
  company: Company;
}
