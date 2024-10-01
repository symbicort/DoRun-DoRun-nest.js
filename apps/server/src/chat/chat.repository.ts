import { Injectable } from '@nestjs/common';
import { MessageSchema, Message } from './model/chat-message.schema';
import { RoomSchema, Room } from './model/chat-room.schema';

@Injectable()
export class ChatRepository {
  // Room 관련 메서드
  async findAllByUserid(userid: string): Promise<Room[]> {
    return RoomSchema.find({ userid }).exec();
  }

  // Message 관련 메서드
  async findMessagesByRoomId(roomid: string): Promise<Message[]> {
    return MessageSchema.find({ roomid }).exec();
  }

  async findMessagesByRoomIdAndGrammarInvalid(
    roomid: string,
  ): Promise<Message[]> {
    return MessageSchema.find({ roomid, grammarValid: false }).exec();
  }
}
