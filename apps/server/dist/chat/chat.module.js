"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_room_schema_1 = require("./model/chat-room.schema");
const mongoose_1 = require("@nestjs/mongoose");
const chat_message_schema_1 = require("./model/chat-message.schema");
const chat_service_1 = require("./service/chat.service");
const TTS_service_1 = require("./service/TTS.service");
const STT_service_1 = require("./service/STT.service");
const chat_room_service_1 = require("./service/chat-room.service");
const chat_message_service_1 = require("./service/chat-message.service");
const chat_repository_1 = require("./repository/chat.repository");
const message_controller_1 = require("./controller/message.controller");
const room_controller_1 = require("./controller/room.controller");
const chat_controller_1 = require("./controller/chat.controller");
const user_module_1 = require("../user/user.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        controllers: [chat_controller_1.ChatController, message_controller_1.MessageController, room_controller_1.RoomController],
        providers: [
            chat_service_1.ChatService,
            TTS_service_1.TTSService,
            STT_service_1.STTService,
            chat_room_service_1.RoomService,
            chat_message_service_1.MessageService,
            chat_repository_1.ChatRepository,
        ],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: chat_room_schema_1.Room.name, schema: chat_room_schema_1.RoomSchema },
                { name: chat_message_schema_1.Message.name, schema: chat_message_schema_1.MessageSchema },
            ]),
            user_module_1.UserModule,
        ],
        exports: [chat_service_1.ChatService, chat_message_service_1.MessageService, chat_room_service_1.RoomService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map