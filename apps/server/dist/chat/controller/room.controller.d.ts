import { Response, Request } from 'express';
import { UserService } from 'src/user/service/user.service';
import { RoomService } from '../service/chat-room.service';
import { MessageService } from '../service/chat-message.service';
import { Room } from '../model/chat-room.schema';
export declare class RoomController {
    private readonly roomService;
    private readonly userService;
    private readonly messageService;
    constructor(roomService: RoomService, userService: UserService, messageService: MessageService);
    getRooms(req: Request, res: Response): Promise<Response>;
    newRoom(room: Room, req: Request, res: Response): Promise<Response>;
}
