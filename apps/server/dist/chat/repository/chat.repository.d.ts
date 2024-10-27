import { Model } from 'mongoose';
import { Message, MessageDocument } from '../model/chat-message.schema';
import { RoomDocument } from '../model/chat-room.schema';
import { MessageDto } from '../dto/chat-message.dto';
import { RoomDto } from '../dto/chat-room.dto';
export declare class ChatRepository {
    private messageModel;
    private roomModel;
    constructor(messageModel: Model<MessageDocument>, roomModel: Model<RoomDocument>);
    newMessage(message: Message): Promise<Message>;
    findRoomId(roomid: string): Promise<MessageDto[]>;
    findByRoomIdAndGrammarValidIsFalse(roomid: string): Promise<MessageDto[]>;
    findRoom(userid: string): Promise<RoomDto[]>;
}
