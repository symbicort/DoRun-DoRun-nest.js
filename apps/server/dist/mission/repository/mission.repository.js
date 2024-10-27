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
exports.MissionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const userMission_entity_1 = require("../entity/userMission.entity");
const mission_entity_1 = require("../entity/mission.entity");
let MissionRepository = class MissionRepository {
    constructor(userMissionRepository, missionRepository) {
        this.userMissionRepository = userMissionRepository;
        this.missionRepository = missionRepository;
    }
    async findByCourse(course) {
        return await this.missionRepository.find({ where: { course } });
    }
    async findByMissionId(missionId) {
        return await this.missionRepository.findOne({ where: { missionId } });
    }
    async findByMissionIdIn(missionIds) {
        return await this.missionRepository.find({
            where: { missionId: (0, typeorm_2.In)(missionIds) },
        });
    }
    async saveUserMission(userMission) {
        return await this.userMissionRepository.save(userMission);
    }
    async saveMission(mission) {
        return await this.missionRepository.save(mission);
    }
    async findByUserIdAndMissionId_Course(user, courseMission) {
        const missions = courseMission.map((mission) => mission.missionId);
        return await this.userMissionRepository.find({
            where: {
                user: {
                    userId: user.userId,
                },
                mission: {
                    missionId: (0, typeorm_2.In)(missions),
                },
            },
        });
    }
    async findByUserIdAndCompleteAndLearn(user, complete, learn) {
        return await this.userMissionRepository.find({
            where: {
                user: {
                    userNum: user.userNum,
                },
                complete: complete,
                learn: learn,
            },
            relations: ['mission'],
        });
    }
    async findByUserIdAndUnLearnAndMissionId_Course(user, learn, course) {
        return await this.userMissionRepository.find({
            relations: ['mission'],
            where: {
                user: {
                    userId: user.userId,
                },
                learn: learn,
                mission: {
                    course: course,
                },
            },
        });
    }
    async findByUserIdAndMissionIdAndLearn(user, mission, learn) {
        return await this.userMissionRepository.findOne({
            where: {
                user: {
                    userId: user.userId,
                },
                mission: {
                    missionId: mission.missionId,
                },
                learn: learn,
            },
        });
    }
    async findByUserIdAndMissionId_MissionIdIn(user, missions) {
        return await this.userMissionRepository.find({
            where: {
                user: user,
                mission: (0, typeorm_2.In)(missions),
            },
        });
    }
    async findByMissionId_MissionIdIn(missionIds) {
        return await this.userMissionRepository.find({
            where: {
                mission: (0, typeorm_2.In)(missionIds),
            },
        });
    }
};
exports.MissionRepository = MissionRepository;
exports.MissionRepository = MissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(userMission_entity_1.UserMissionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(mission_entity_1.MissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MissionRepository);
//# sourceMappingURL=mission.repository.js.map