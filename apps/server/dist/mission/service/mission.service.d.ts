import { UserRepository } from 'src/user/repository/user.repository';
import { MissionRepository } from '../repository/mission.repository';
import { UserService } from 'src/user/service/user.service';
import { ChatService } from 'src/chat/service/chat.service';
import { MissionDto } from '../dto/mission.dto';
export declare class MissionService {
    private readonly userRepository;
    private readonly missionRepository;
    private readonly userService;
    private readonly chatService;
    private readonly client;
    constructor(userRepository: UserRepository, missionRepository: MissionRepository, userService: UserService, chatService: ChatService);
    addUserMissionsForCourse(course: string, accessToken: string, refreshToken: string): Promise<void>;
    getUnLearnMissionsForUser(course: string, accessToken: string, refreshToken: string): Promise<MissionDto[]>;
    setLearnMissionsForUser(accessToken: string, refreshToken: string, missionId: number): Promise<void>;
    getUncompletedMissionsForUser(accessToken: string, refreshToken: string): Promise<MissionDto[]>;
    textPrompt(data: string): Promise<string>;
    makePrompt(data: string): Promise<string>;
    predictTextPrompt(request_message: string, parameters: string, project: string, location: string): Promise<string>;
    setMissionCompleteForUser(accessToken: string, refreshToken: string, missionIds: string[]): Promise<void>;
}
