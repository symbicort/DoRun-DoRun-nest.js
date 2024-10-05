import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Room } from './model/chat-room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './model/chat-message.schema';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: Room },
      { name: Message.name, schema: Message },
    ]),
  ],
})
export class ChatModule {}
