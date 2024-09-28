import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MissionModule } from './mission/mission.module';

@Module({
  imports: [UserModule, ChatModule, MissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
