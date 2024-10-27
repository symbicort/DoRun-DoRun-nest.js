import { Repository } from 'typeorm';
import { UserMissionEntity } from '../entity/userMission.entity';
import { User } from 'src/user/entity/user.entity';
import { MissionEntity } from '../entity/mission.entity';
export declare class MissionRepository {
    private readonly userMissionRepository;
    private readonly missionRepository;
    constructor(userMissionRepository: Repository<UserMissionEntity>, missionRepository: Repository<MissionEntity>);
    findByCourse(course: string): Promise<MissionEntity[]>;
    findByMissionId(missionId: number): Promise<MissionEntity | undefined>;
    findByMissionIdIn(missionIds: number[]): Promise<MissionEntity[]>;
    saveUserMission(userMission: UserMissionEntity): Promise<UserMissionEntity>;
    saveMission(mission: MissionEntity): Promise<MissionEntity>;
    findByUserIdAndMissionId_Course(user: User, courseMission: MissionEntity[]): Promise<UserMissionEntity[]>;
    findByUserIdAndCompleteAndLearn(user: User, complete: boolean, learn: boolean): Promise<UserMissionEntity[]>;
    findByUserIdAndUnLearnAndMissionId_Course(user: User, learn: boolean, course: string): Promise<UserMissionEntity[]>;
    findByUserIdAndMissionIdAndLearn(user: User, mission: MissionEntity, learn: boolean): Promise<UserMissionEntity>;
    findByUserIdAndMissionId_MissionIdIn(user: User, missions: string[]): Promise<UserMissionEntity[]>;
    findByMissionId_MissionIdIn(missionIds: string[]): Promise<UserMissionEntity[]>;
}
