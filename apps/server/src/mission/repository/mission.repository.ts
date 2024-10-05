import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserMissionEntity } from '../entity/userMission.entity';
import { User } from 'src/user/entity/user.entity';
import { MissionEntity } from '../entity/mission.entity';

@Injectable()
export class MissionRepository {
  constructor(
    @InjectRepository(UserMissionEntity)
    private readonly userMissionRepository: Repository<UserMissionEntity>,
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
  ) {}

  // course에 해당하는 mission 찾기
  async findByCourse(course: string): Promise<MissionEntity[]> {
    return this.missionRepository.find({ where: { course } });
  }

  // missionId로 mission 찾기
  async findByMissionId(missionId: string): Promise<MissionEntity | undefined> {
    return this.missionRepository.findOne({ where: { missionId } });
  }

  // missionId 리스트에 해당하는 mission 찾기
  async findByMissionIdIn(missionIds: string[]): Promise<MissionEntity[]> {
    return this.missionRepository.find({
      where: { missionId: In(missionIds) },
    });
  }

  async saveUserMission(
    userMission: UserMissionEntity,
  ): Promise<UserMissionEntity> {
    return this.userMissionRepository.save(userMission);
  }

  // 초기 미션 생성?
  async saveMission(mission: MissionEntity): Promise<MissionEntity> {
    return this.missionRepository.save(mission);
  }

  async findByUserIdAndMissionId_Course(
    user: User,
    course: string,
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        userId: user, // User 객체 사용
        missionId: {
          course: course, // MissionEntity의 course에 접근
        },
      },
    });
  }

  async findByUserIdAndCompleteAndLearn(
    user: User,
    complete: boolean,
    learn: boolean,
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        userId: user,
        complete: complete,
        learn: learn,
      },
    });
  }

  async findByUserIdAndLearnAndMissionId_Course(
    user: User,
    learn: boolean,
    course: string,
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        userId: user, // User 객체 사용
        learn: learn,
        missionId: {
          course: course, // MissionEntity의 course에 접근
        },
      },
    });
  }

  async findByUserIdAndMissionIdAndLearn(
    user: User,
    mission: MissionEntity,
    learn: boolean,
  ): Promise<UserMissionEntity> {
    return this.userMissionRepository.findOne({
      where: {
        userId: user, // User 객체 사용
        missionId: mission, // MissionEntity 객체 사용
        learn: learn,
      },
    });
  }

  async findByUserIdAndMissionId_MissionIdIn(
    user: User,
    missions: string[],
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        userId: user,
        missionId: In(missions),
      },
    });
  }

  async findByMissionId_MissionIdIn(
    missionIds: string[],
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        missionId: In(missionIds),
      },
    });
  }
}
