import { Model } from 'mongoose';
import { MessageDocument } from '../model/chat-message.schema';
import { Room } from '../model/chat-room.schema';
import { ChatRepository } from '../repository/chat.repository';
import { MessageDto } from '../dto/chat-message.dto';
export declare class MessageService {
    private readonly messageModel;
    private readonly chatRepository;
    constructor(messageModel: Model<MessageDocument>, chatRepository: ChatRepository);
    findByRoomid(roomid: string): Promise<MessageDto[]>;
    findByRoomidAndGrammarValidIsFalse(roomid: string): Promise<MessageDto[]>;
    addMessagesByRoomId(room: Room, messages: string[]): Promise<void>;
}
