import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../model/chat-message.schema';
import { Room, RoomDocument } from '../model/chat-room.schema';
import { MessageDto } from '../dto/chat-message.dto';
import { RoomDto } from '../dto/chat-room.dto';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async findRoomId(roomid: string): Promise<MessageDto[]> {
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
      } as MessageDto;
    });
  }

  async findByRoomIdAndGrammarValidIsFalse(
    roomid: string,
  ): Promise<MessageDto[]> {
    const messages = await this.messageModel
      .find({ roomid, grammarValid: false })
      .exec();
    return messages.map((message) => {
      return {
        roomid: message.roomid,
        content: message.content,
        grammarValid: message.grammarValid,
        id: message._id.toString(),
      } as MessageDto;
    });
  }

  async findRoom(userid: string): Promise<RoomDto[]> {
    const rooms = await this.roomModel.find({ userid }).exec();

    return rooms.map((room) => {
      return {
        id: room._id.toString(),
        userid: room.userid,
        ai: room.ai,
        createdAt: room.createdAt,
      } as RoomDto;
    });
  }
}
