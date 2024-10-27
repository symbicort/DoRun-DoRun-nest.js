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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/service/user.service");
const chat_room_service_1 = require("../service/chat-room.service");
const chat_message_service_1 = require("../service/chat-message.service");
const chat_room_schema_1 = require("../model/chat-room.schema");
let RoomController = class RoomController {
    constructor(roomService, userService, messageService) {
        this.roomService = roomService;
        this.userService = userService;
        this.messageService = messageService;
    }
    async getRooms(req, res) {
        try {
            const accessToken = req.cookies['accessToken'];
            const refreshToken = req.cookies['refreshToken'];
            const authUser = await this.userService.authuser(accessToken, refreshToken);
            const roomDtos = await this.roomService.findAllByUserid(authUser.userId);
            return res.json(roomDtos);
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: 'Error occurred while retrieving rooms' });
        }
    }
    async newRoom(room, req, res) {
        try {
            console.log('room data', room);
            const accessToken = req.cookies['accessToken'];
            const refreshToken = req.cookies['refreshToken'];
            const authUser = await this.userService.authuser(accessToken, refreshToken);
            room.userid = authUser.userId;
            const newRoom = await this.roomService.newRoom(room);
            console.log('생성된 룸 확인', newRoom);
            await this.messageService.addMessagesByRoomId(newRoom, room.messages);
            return res.json({ id: newRoom._id });
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: 'Error occurred while creating a new room' });
        }
    }
};
exports.RoomController = RoomController;
__decorate([
    (0, common_1.Get)('getRooms'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Post)('newRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_room_schema_1.Room, Object, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "newRoom", null);
exports.RoomController = RoomController = __decorate([
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [chat_room_service_1.RoomService,
        user_service_1.UserService,
        chat_message_service_1.MessageService])
], RoomController);
//# sourceMappingURL=room.controller.js.map