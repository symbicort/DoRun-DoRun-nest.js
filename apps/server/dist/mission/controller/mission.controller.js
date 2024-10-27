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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionController = void 0;
const common_1 = require("@nestjs/common");
const mission_service_1 = require("../service/mission.service");
const mission_dto_1 = require("../dto/mission.dto");
const practice_service_1 = require("../service/practice.service");
let MissionController = class MissionController {
    constructor(missionService, practiceService) {
        this.missionService = missionService;
        this.practiceService = practiceService;
    }
    async addUserMissionsForCourse(req) {
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];
        const { course } = req.body;
        await this.missionService.addUserMissionsForCourse(course, accessToken, refreshToken);
    }
    async getUnLearnMissionsForUser(course, req) {
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];
        console.log('토큰 받음', accessToken, refreshToken, course);
        return await this.missionService.getUnLearnMissionsForUser(course, accessToken, refreshToken);
    }
    async setLearnMissionsForUser(request, req) {
        const { mission_id } = request;
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];
        console.log('learned API REQ', mission_id, accessToken, refreshToken);
        await this.missionService.setLearnMissionsForUser(accessToken, refreshToken, mission_id);
    }
    async getUncompletedMissionsForUser(req) {
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];
        return await this.missionService.getUncompletedMissionsForUser(accessToken, refreshToken);
    }
    async checkMission(postData) {
        console.log('Received data from client:', postData.missions.length);
        if (postData.missions.length === 0) {
            return;
        }
        const response = await this.missionService.textPrompt(JSON.stringify(postData));
        return response;
    }
    async setMissionCompleteForUser(request, req) {
        try {
            const { missionId } = request;
            const accessToken = req.cookies['accessToken'];
            const refreshToken = req.cookies['refreshToken'];
            await this.missionService.setMissionCompleteForUser(accessToken, refreshToken, missionId);
            return 'Learned missions marked successfully.';
        }
        catch (error) {
            throw new common_1.HttpException('An error occurred while marking missions as learned.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPractice(expression, meaning, level) {
        try {
            return await this.practiceService.getPractice(expression, meaning, level);
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.MissionController = MissionController;
__decorate([
    (0, common_1.Post)('course'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "addUserMissionsForCourse", null);
__decorate([
    (0, common_1.Get)('learn'),
    __param(0, (0, common_1.Query)('course')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "getUnLearnMissionsForUser", null);
__decorate([
    (0, common_1.Post)('learned'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "setLearnMissionsForUser", null);
__decorate([
    (0, common_1.Get)('missions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "getUncompletedMissionsForUser", null);
__decorate([
    (0, common_1.Post)('checkMission'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mission_dto_1.checkMissionDto]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "checkMission", null);
__decorate([
    (0, common_1.Post)('missionComplete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "setMissionCompleteForUser", null);
__decorate([
    (0, common_1.Get)('practice'),
    __param(0, (0, common_1.Query)('expression')),
    __param(1, (0, common_1.Query)('meaning')),
    __param(2, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "getPractice", null);
exports.MissionController = MissionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [mission_service_1.MissionService,
        practice_service_1.PracticeService])
], MissionController);
//# sourceMappingURL=mission.controller.js.map