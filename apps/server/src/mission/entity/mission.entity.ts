import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('mission')
export class MissionEntity {
    @PrimaryColumn({ name: 'missionId' })
    missionId: string;

    @Column({ name: 'course' })
    course: string;

    @Column({ name: 'mission' })
    mission: string;

    @Column({ name: 'meaning' })
    meaning: string;
}
