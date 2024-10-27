"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const chat_module_1 = require("./chat/chat.module");
const mission_module_1 = require("./mission/mission.module");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: '.env',
            }),
            user_module_1.UserModule,
            chat_module_1.ChatModule,
            mission_module_1.MissionModule,
            mongoose_1.MongooseModule.forRoot(String(process.env.MONGODB_URI)),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: Number(process.env.MYSQL_PORT),
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                synchronize: true,
                autoLoadEntities: true,
                timezone: '+09:00',
                logging: false,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map