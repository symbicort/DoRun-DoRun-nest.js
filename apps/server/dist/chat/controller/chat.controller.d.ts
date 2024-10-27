import { STTService } from '../service/STT.service';
import { ChatService } from '../service/chat.service';
import { UserService } from 'src/user/service/user.service';
import { TTSService } from '../service/TTS.service';
import { ChatDto } from '../dto/chat.dto';
import { SendChatDto } from 'src/user/dto/user.dto';
import { Request } from 'express';
export declare class ChatController {
    private readonly chatService;
    private readonly userService;
    private readonly ttsService;
    private readonly sttService;
    constructor(chatService: ChatService, userService: UserService, ttsService: TTSService, sttService: STTService);
    getCorrection(chatDto: ChatDto): Promise<string[]>;
    sendChat(req: Request, chatDto: ChatDto): Promise<SendChatDto>;
    stt(audioFile: Express.Multer.File): Promise<string>;
}
