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
import { Company } from '../../company/entities';
import { UserActions } from '../../actions/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
