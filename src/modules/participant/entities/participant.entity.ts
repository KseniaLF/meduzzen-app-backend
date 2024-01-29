import { Role } from '../../../common/enum';
import { User } from '../../user/entities';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../company/entities';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @ManyToOne(() => Company, (company) => company.participants)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
