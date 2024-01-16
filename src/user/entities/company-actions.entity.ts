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
import { Company } from '../../modules/company/entities/company.entity';
import { User } from './user.entity';

@Entity()
export class UserActions {
  @PrimaryGeneratedColumn()
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

  // companies that have sent the user an invitations to join
  @ManyToMany(() => Company, (company) => company.userInvitations)
  @JoinTable()
  companyInvitations: Company[];

  // companies to which this user has sent a request to join
  @ManyToMany(() => Company, (company) => company.userRequests)
  @JoinTable()
  companyRequests: Company[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
