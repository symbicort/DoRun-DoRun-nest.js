"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionService = void 0;
const common_1 = require("@nestjs/common");
const aiplatform_1 = require("@google-cloud/aiplatform");
const user_repository_1 = require("../../user/repository/user.repository");
const mission_repository_1 = require("../repository/mission.repository");
const userMission_entity_1 = require("../entity/userMission.entity");
const user_service_1 = require("../../user/service/user.service");
const chat_service_1 = require("../../chat/service/chat.service");
const mission_dto_1 = require("../dto/mission.dto");
let MissionService = class MissionService {
    constructor(userRepository, missionRepository, userService, chatService) {
        this.userRepository = userRepository;
        this.missionRepository = missionRepository;
        this.userService = userService;
        this.chatService = chatService;
        this.client = new aiplatform_1.PredictionServiceClient({
            projectId: 'augmented-voice-443414-c8',
        });
    }
    async addUserMissionsForCourse(course, accessToken, refreshToken) {
        try {
            const authuserDto = await this.userService.authuser(accessToken, refreshToken);
            if (!authuserDto.result) {
                return;
            }
            const courseMission = await this.missionRepository.findByCourse(course);
            const userId = authuserDto.userId;
            const user = await this.userRepository.findByUserId(userId);
            const existingMissions = await this.missionRepository.findByUserIdAndMissionId_Course(user, courseMission);
            if (existingMissions.length > 0) {
                return;
            }
            for (const mission of courseMission) {
                const userMission = new userMission_entity_1.UserMissionEntity();
                userMission.user = user;
                userMission.mission = mission;
                userMission.complete = false;
                userMission.learn = false;
                await this.missionRepository.saveUserMission(userMission);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    async getUnLearnMissionsForUser(course, accessToken, refreshToken) {
        const authuserDto = await this.userService.authuser(accessToken, refreshToken);
        if (!authuserDto.result) {
            return [];
        }
        const userId = authuserDto.userId;
        const user = await this.userRepository.findByUserId(userId);
        const unLearnMissions = await this.missionRepository.findByUserIdAndUnLearnAndMissionId_Course(user, false, course);
        if (unLearnMissions.length === 0) {
            return [];
        }
        const shuffledMissions = unLearnMissions.sort(() => 0.5 - Math.random());
        const limitedUnlearnMissions = shuffledMissions.slice(0, 3);
        const result = [];
        for (const limitedUnlearnMission of limitedUnlearnMissions) {
            const userMissionDto = new mission_dto_1.MissionDto();
            userMissionDto.missionId = limitedUnlearnMission.mission.missionId;
            userMissionDto.mission = limitedUnlearnMission.mission.mission;
            userMissionDto.meaning = limitedUnlearnMission.mission.meaning;
            userMissionDto.complete = limitedUnlearnMission.complete;
            result.push(userMissionDto);
        }
        return result;
    }
    async setLearnMissionsForUser(accessToken, refreshToken, missionId) {
        try {
            const authuserDto = await this.userService.authuser(accessToken, refreshToken);
            if (!authuserDto.result) {
                return;
            }
            const userId = authuserDto.userId;
            const user = await this.userRepository.findByUserId(userId);
            const mission = await this.missionRepository.findByMissionId(missionId);
            console.log('검색 조건', user, mission);
            const userMission = await this.missionRepository.findByUserIdAndMissionIdAndLearn(user, mission, false);
            console.log('미션 데이터 find 결과', userMission);
            if (!userMission) {
                console.log('학습 정보와 일치하는 유저 데이터가 없습니다.');
                return;
            }
            userMission.learn = true;
            await this.missionRepository.saveUserMission(userMission);
        }
        catch (e) {
            console.error(e);
        }
    }
    async getUncompletedMissionsForUser(accessToken, refreshToken) {
        try {
            const authuserDto = await this.userService.authuser(accessToken, refreshToken);
            if (!authuserDto.result) {
                return [];
            }
            const userId = authuserDto.userId;
            const user = await this.userRepository.findByUserId(userId);
            const unusedMissions = await this.missionRepository.findByUserIdAndCompleteAndLearn(user, false, true);
            if (unusedMissions.length === 0) {
                return [];
            }
            const shuffledMissions = unusedMissions.sort(() => 0.5 - Math.random());
            const limitedUnusedMissions = shuffledMissions.slice(0, 3);
            const result = [];
            for (const limitedUnusedMission of limitedUnusedMissions) {
                const userMissionDto = new mission_dto_1.MissionDto();
                userMissionDto.missionId = limitedUnusedMission.mission.missionId;
                userMissionDto.mission = limitedUnusedMission.mission.mission;
                userMissionDto.meaning = limitedUnusedMission.mission.meaning;
                userMissionDto.complete = limitedUnusedMission.complete;
                result.push(userMissionDto);
            }
            return result;
        }
        catch (e) {
            console.error(e);
        }
    }
    async textPrompt(data) {
        const prompt = await this.makePrompt(data);
        const request_message = `{ "prompt": "Check which expression from the missions the chat corresponds to and return the corresponding missionId(s) as an Array. (e.g. ['lv1_1', 'lv_2']) If no matching missions are found or if the chat sentence does not match the expression from any of the missions, return none in lower case.",${prompt}}`;
        const response = await this.chatService.sendTextRequest(request_message);
        return response.candidates[0].content.parts[0].text;
    }
    async makePrompt(data) {
        try {
            const jsonData = JSON.parse(data);
            let prompt = '';
            for (const mission of jsonData.missions) {
                prompt += `"missionId": ${mission.missionId}\n,`;
                prompt += `"mission": "${mission.mission}"\n\n,`;
            }
            prompt += `"chat": "${jsonData.chat}"`;
            return prompt;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    async predictTextPrompt(request_message, parameters, project, location) {
        try {
            console.log('value.json', request_message, typeof request_message);
            const endpointName = `projects/${project}/locations/${location}/publishers/google/models/text-bison@002`;
            const check = await this.chatService.sendTextRequest(request_message);
            console.log('미션 성공 여부 방법 변경', check.candidates[0].content.parts[0].text);
            return null;
        }
        catch (err) {
            console.error('predictTextPrompt', err);
        }
    }
    async setMissionCompleteForUser(accessToken, refreshToken, missionIds) {
        const authuserDto = await this.userService.authuser(accessToken, refreshToken);
        if (!authuserDto.result) {
            return;
        }
        const userId = authuserDto.userId;
        const user = await this.userRepository.findByUserId(userId);
        if (user) {
            const userMissions = await this.missionRepository.findByUserIdAndMissionId_MissionIdIn(user, missionIds);
            for (const userMission of userMissions) {
                userMission.complete = true;
                await this.missionRepository.saveUserMission(userMission);
            }
        }
    }
};
exports.MissionService = MissionService;
exports.MissionService = MissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        mission_repository_1.MissionRepository,
        user_service_1.UserService,
        chat_service_1.ChatService])
], MissionService);
//# sourceMappingURL=mission.service.js.map