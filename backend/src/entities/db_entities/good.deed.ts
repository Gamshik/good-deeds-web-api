import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@Entity('GoodDeeds')
export class GoodDeed {
  @PrimaryGeneratedColumn()
  @AutoMap()
  Id: number;

  @Column({
    nullable: false,
  })
  @AutoMap()
  UserId: number;

  @Column({
    nullable: false,
  })
  @AutoMap()
  GoodDeed: string;

  @ManyToOne(() => User, (user) => user.GoodDeeds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
  User: User;
}
