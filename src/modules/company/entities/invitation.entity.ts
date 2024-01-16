import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserActions } from '../../../user/entities';
import { Company } from './company.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Content' })
  message: string;

  @ManyToOne(() => UserActions, (user) => user.invitations)
  user: UserActions;

  @ManyToOne(() => Company, (company) => company.invitations)
  company: Company;
}
