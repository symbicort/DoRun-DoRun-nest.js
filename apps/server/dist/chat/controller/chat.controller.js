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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const STT_service_1 = require("../service/STT.service");
const chat_service_1 = require("../service/chat.service");
const user_service_1 = require("../../user/service/user.service");
const TTS_service_1 = require("../service/TTS.service");
const chat_dto_1 = require("../dto/chat.dto");
const user_dto_1 = require("../../user/dto/user.dto");
let ChatController = class ChatController {
    constructor(chatService, userService, ttsService, sttService) {
        this.chatService = chatService;
        this.userService = userService;
        this.ttsService = ttsService;
        this.sttService = sttService;
    }
    async getCorrection(chatDto) {
        return this.chatService.getCorrection(chatDto);
    }
    async sendChat(req, chatDto) {
        const sendChatDto = new user_dto_1.SendChatDto();
        try {
            const accessToken = req.cookies['accessToken'];
            const refreshToken = req.cookies['refreshToken'];
            const authUser = await this.userService.authuser(accessToken, refreshToken);
            chatDto.messages = chatDto.messages;
            const getAnswerDto = await this.chatService.getAnswer(chatDto);
            await this.ttsService.callExternalApi(getAnswerDto.aiMsg);
            sendChatDto.aimsg = getAnswerDto.aiMsg;
            sendChatDto.result = true;
            sendChatDto.userMsg = chatDto.messages.join(', ');
            sendChatDto.emotion = getAnswerDto.emotion.split('\n')[0];
            if (!authUser.result) {
                return sendChatDto;
            }
            else {
                sendChatDto.nickname = authUser.nickname;
                return sendChatDto;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async stt(audioFile) {
        if (!audioFile) {
            throw new common_1.BadRequestException('No audio file provided');
        }
        try {
            return await this.sttService.speechToText(audioFile);
        }
        catch (error) {
            throw new common_1.BadRequestException(`STT failed: ${error.message}`);
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('getCorrection'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getCorrection", null);
__decorate([
    (0, common_1.Post)('sendChat'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.ChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendChat", null);
__decorate([
    (0, common_1.Post)('speech'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "stt", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService,
        TTS_service_1.TTSService,
        STT_service_1.STTService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map