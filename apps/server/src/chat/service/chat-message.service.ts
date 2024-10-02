import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDocument, Message } from '../model/chat-message.schema';
import { Room } from '../model/chat-room.schema';
import { ChatRepository } from '../repository/chat.repository';
import { MessageDto } from '../dto/chat-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly chatRepository: ChatRepository,
  ) {}

  async findByRoomid(roomid: string): Promise<MessageDto[]> {
    return this.chatRepository.findRoomId(roomid);
  }

  async findByRoomidAndGrammarValidIsFalse(
    roomid: string,
  ): Promise<MessageDto[]> {
    return this.chatRepository.findByRoomIdAndGrammarValidIsFalse(roomid);
  }

  async addMessagesByRoomId(room: Room, messages: string[]): Promise<void> {
    for (const message of messages) {
      const temp = new this.messageModel();
      temp.roomid = room._id.toString();
      temp.userid = room.userid;
      temp.ai = room.ai;

      const content = message.split(': ');

      if (content[0].includes('user')) {
        // 유저면
        temp.userSpeaking = true;

        if (content[1].includes('->')) {
          // 교정받은거
          temp.grammarValid = false;
          const two = content[1].split('->');
          temp.content = two[0].trim();
          temp.correctedContent = two[1].trim();
        } else {
          // 교정 안받은거
          temp.grammarValid = true;
          temp.content = content[1].trim();
        }
      } else {
        // ai면
        temp.userSpeaking = false;
        temp.content = content[1].trim();
        temp.grammarValid = true;
      }

      await temp.save(); // 각 메시지를 저장할 때까지 기다림
    }
  }
}
