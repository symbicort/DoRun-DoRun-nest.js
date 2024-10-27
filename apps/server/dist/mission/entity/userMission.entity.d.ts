import { User } from '../../user/entity/user.entity';
import { MissionEntity } from './mission.entity';
export declare class UserMissionEntity {
    no: number;
    user: User;
    mission: MissionEntity;
    complete: boolean;
    learn: boolean;
}
