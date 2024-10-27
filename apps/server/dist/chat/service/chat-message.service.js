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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_message_schema_1 = require("../model/chat-message.schema");
const chat_repository_1 = require("../repository/chat.repository");
let MessageService = class MessageService {
    constructor(messageModel, chatRepository) {
        this.messageModel = messageModel;
        this.chatRepository = chatRepository;
    }
    async findByRoomid(roomid) {
        return this.chatRepository.findRoomId(roomid);
    }
    async findByRoomidAndGrammarValidIsFalse(roomid) {
        return this.chatRepository.findByRoomIdAndGrammarValidIsFalse(roomid);
    }
    async addMessagesByRoomId(room, messages) {
        try {
            console.log('message data', messages);
            for (const message of messages) {
                const temp = new this.messageModel();
                temp.roomid = room._id.toString();
                temp.userid = room.userid;
                temp.ai = room.ai;
                const content = message.split(': ');
                console.log('모델 데이터', temp, '메시지 데이터', content);
                if (content[0].includes('user')) {
                    temp.userSpeaking = true;
                    if (content[1].includes('->')) {
                        temp.grammarValid = false;
                        const two = content[1].split('->');
                        temp.content = two[0].trim();
                        temp.correctedContent = two[1].trim();
                    }
                    else {
                        temp.grammarValid = true;
                        temp.content = content[1].trim();
                    }
                }
                else {
                    temp.userSpeaking = false;
                    temp.content = content[1].trim();
                    temp.grammarValid = true;
                }
                await this.chatRepository.newMessage(temp);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        chat_repository_1.ChatRepository])
], MessageService);
//# sourceMappingURL=chat-message.service.js.map