import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mission')
export class MissionEntity {
  @PrimaryGeneratedColumn({ name: 'mission_id' })
  missionId: number;

  @Column({ name: 'course' })
  course: string;

  @Column({ name: 'mission' })
  mission: string;

  @Column({ name: 'meaning' })
  meaning: string;
}
