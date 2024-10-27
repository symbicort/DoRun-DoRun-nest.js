import { Response } from 'express';
import { MessageService } from '../service/chat-message.service';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    getMessagesByRoomid(roomid: string, res: Response): Promise<Response>;
    getWrongMessagesByRoomid(roomid: string, res: Response): Promise<Response>;
}
