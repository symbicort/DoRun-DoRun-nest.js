import { MissionService } from '../service/mission.service';
import { Request } from 'express';
import { checkMissionDto, MissionDto } from '../dto/mission.dto';
import { PracticeService } from '../service/practice.service';
export declare class MissionController {
    private readonly missionService;
    private readonly practiceService;
    constructor(missionService: MissionService, practiceService: PracticeService);
    addUserMissionsForCourse(req: Request): Promise<void>;
    getUnLearnMissionsForUser(course: string, req: Request): Promise<MissionDto[]>;
    setLearnMissionsForUser(request: {
        mission_id: number;
    }, req: Request): Promise<void>;
    getUncompletedMissionsForUser(req: Request): Promise<MissionDto[]>;
    checkMission(postData: checkMissionDto): Promise<string>;
    setMissionCompleteForUser(request: {
        missionId: string[];
    }, req: Request): Promise<string>;
    getPractice(expression: string, meaning: string, level: number): Promise<import("../dto/mission.dto").getPracticeResDto>;
}
