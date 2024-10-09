import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { Room, RoomSchema } from './model/chat-room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './model/chat-message.schema';
import { ChatService } from './service/chat.service';
import { TTSService } from './service/TTS.service';
import { STTService } from './service/STT.service';
import { RoomService } from './service/chat-room.service';
import { MessageService } from './service/chat-message.service';
import { ChatRepository } from './repository/chat.repository';
import { MessageController } from './controller/message.controller';
import { RoomController } from './controller/room.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ChatController, MessageController, RoomController],
  providers: [
    ChatService,
    TTSService,
    STTService,
    RoomService,
    MessageService,
    ChatRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    UserModule,
  ],
  exports: [ChatService, MessageService, RoomService],
})
export class ChatModule {}
