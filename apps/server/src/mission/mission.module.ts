import { Module } from '@nestjs/common';
import { MissionController } from './controller/mission.controller';
import { MissionService } from './service/mission.service';
import { MissionEntity } from './entity/mission.entity';
import { UserMissionEntity } from './entity/userMission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MissionController],
  providers: [MissionService],
  imports: [TypeOrmModule.forFeature([MissionEntity, UserMissionEntity])],
})
export class MissionModule {}
