import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { MissionEntity } from './mission.entity';

@Entity('user_mission')
export class UserMissionEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @ManyToOne(() => MissionEntity)
  @JoinColumn({ name: 'missionId' })
  missionId: MissionEntity;

  @Column({ name: 'complete', default: false })
  complete: boolean;

  @Column({ name: 'learn', default: false })
  learn: boolean;
}
