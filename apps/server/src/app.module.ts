import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MissionModule } from './mission/mission.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionEntity } from './mission/entity/userMission.entity';
import { User } from './user/entity/user.entity';
import { MissionEntity } from './mission/entity/mission.entity';

console.log(process.env.MONGODB_URI)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    UserModule,
    ChatModule,
    MissionModule,
    MongooseModule.forRoot(String(process.env.MONGODB_URI)),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.RDS_MYSQL_HOST,
      port: Number(process.env.RDS_MYSQL_PORT),
      username: process.env.RDS_MYSQL_USERNAME,
      password: process.env.RDS_MYSQL_PW,
      database: process.env.RDS_MYSQL_NAME,
      entities: [UserMissionEntity, User, MissionEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
