import { Module } from '@nestjs/common';
import { MissionController } from './controller/mission.controller';
import { MissionService } from './service/mission.service';

@Module({
  controllers: [MissionController],
  providers: [MissionService]
})
export class MissionModule {}
