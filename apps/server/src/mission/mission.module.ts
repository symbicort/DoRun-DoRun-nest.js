import { Module } from '@nestjs/common';
import { MissionController } from './controller/mission.controller';
import { MissionService } from './service/mission.service';
import { MissionEntity } from './entity/mission.entity';
import { UserMissionEntity } from './entity/userMission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { PracticeService } from './service/practice.service';
import { ChatService } from 'src/chat/service/chat.service';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { MissionRepository } from './repository/mission.repository';
import { PracticeContext } from 'src/constants/practice-context';

@Module({
  controllers: [MissionController],
  providers: [
    MissionService,
    PracticeService,
    MissionRepository,
    PracticeContext,
  ],
  imports: [
    TypeOrmModule.forFeature([MissionEntity, UserMissionEntity]),
    UserModule,
    ChatModule,
  ],
  exports: [MissionService, PracticeService],
})
export class MissionModule {}
