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
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_message_schema_1 = require("../model/chat-message.schema");
const chat_room_schema_1 = require("../model/chat-room.schema");
let ChatRepository = class ChatRepository {
    constructor(messageModel, roomModel) {
        this.messageModel = messageModel;
        this.roomModel = roomModel;
    }
    async newMessage(message) {
        const newMessage = new this.messageModel(message);
        return newMessage.save();
    }
    async findRoomId(roomid) {
        const messages = await this.messageModel.find({ roomid }).exec();
        console.log(messages);
        return messages.map((message) => {
            return {
                roomid: message.roomid,
                content: message.content,
                grammarValid: message.grammarValid,
                id: message._id.toString(),
                userid: message.userid,
                ai: message.ai,
                userSpeaking: message.userSpeaking,
                createdAt: message.createdAt,
                correctedContent: message.correctedContent,
            };
        });
    }
    async findByRoomIdAndGrammarValidIsFalse(roomid) {
        const messages = await this.messageModel
            .find({ roomid, grammarValid: false })
            .exec();
        return messages.map((message) => {
            return {
                roomid: message.roomid,
                content: message.content,
                grammarValid: message.grammarValid,
                id: message._id.toString(),
            };
        });
    }
    async findRoom(userid) {
        const rooms = await this.roomModel.find({ userid }).exec();
        return rooms.map((room) => {
            return {
                id: room._id.toString(),
                userid: room.userid,
                ai: room.ai,
                createdAt: room.createdAt,
            };
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_message_schema_1.Message.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map