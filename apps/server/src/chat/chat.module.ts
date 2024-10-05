import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { Room } from './model/chat-room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './model/chat-message.schema';
import { ChatService } from './service/chat.service';
import { TTSService } from './service/TTS.service';
import { STTService } from './service/STT.service';
import { RoomService } from './service/chat-room.service';
import { MessageService } from './service/chat-message.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, TTSService, STTService, RoomService, MessageService],
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: Room },
      { name: Message.name, schema: Message },
    ]),
  ],
})
export class ChatModule {}
