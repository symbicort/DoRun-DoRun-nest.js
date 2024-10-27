"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionModule = void 0;
const common_1 = require("@nestjs/common");
const mission_controller_1 = require("./controller/mission.controller");
const mission_service_1 = require("./service/mission.service");
const mission_entity_1 = require("./entity/mission.entity");
const userMission_entity_1 = require("./entity/userMission.entity");
const typeorm_1 = require("@nestjs/typeorm");
const chat_module_1 = require("../chat/chat.module");
const practice_service_1 = require("./service/practice.service");
const user_module_1 = require("../user/user.module");
const mission_repository_1 = require("./repository/mission.repository");
const practice_context_1 = require("../constants/practice-context");
let MissionModule = class MissionModule {
};
exports.MissionModule = MissionModule;
exports.MissionModule = MissionModule = __decorate([
    (0, common_1.Module)({
        controllers: [mission_controller_1.MissionController],
        providers: [
            mission_service_1.MissionService,
            practice_service_1.PracticeService,
            mission_repository_1.MissionRepository,
            practice_context_1.PracticeContext,
        ],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([mission_entity_1.MissionEntity, userMission_entity_1.UserMissionEntity]),
            user_module_1.UserModule,
            chat_module_1.ChatModule,
        ],
        exports: [mission_service_1.MissionService, practice_service_1.PracticeService],
    })
], MissionModule);
//# sourceMappingURL=mission.module.js.map