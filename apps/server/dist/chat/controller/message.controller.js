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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const chat_message_service_1 = require("../service/chat-message.service");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    async getMessagesByRoomid(roomid, res) {
        try {
            const messageDtos = await this.messageService.findByRoomid(roomid);
            return res.json(messageDtos);
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: 'Error occurred while retrieving messages' });
        }
    }
    async getWrongMessagesByRoomid(roomid, res) {
        try {
            const wrongMessagesDtos = await this.messageService.findByRoomidAndGrammarValidIsFalse(roomid);
            return res.json(wrongMessagesDtos);
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: 'Error occurred while retrieving wrong messages' });
        }
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)('getMessagesByRoomid'),
    __param(0, (0, common_1.Query)('roomid')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessagesByRoomid", null);
__decorate([
    (0, common_1.Get)('wrongMessages'),
    __param(0, (0, common_1.Query)('roomid')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getWrongMessagesByRoomid", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('message'),
    __metadata("design:paramtypes", [chat_message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map