import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Auth } from './auth.entity';
import { UserActions } from './company-actions.entity';
import { Company } from '../../modules/company/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @OneToOne(() => Auth)
  @JoinColumn()
  auth: Auth;

  @OneToOne(() => UserActions)
  @JoinColumn()
  actions: UserActions;

  // my companies
  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];

  // // companies where I am a participant
  // @ManyToMany(() => Company, (company) => company.participants)
  // @JoinTable()
  // companyParticipations: Company[];

  // // companies that have sent the user an invitations to join
  // @ManyToMany(() => Company, (company) => company.userInvitations)
  // @JoinTable()
  // companyInvitations: Company[];

  // // companies to which this user has sent a request to join
  // @ManyToMany(() => Company, (company) => company.userRequests)
  // @JoinTable()
  // companyRequests: Company[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
