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

  async findByUserIdAndMissionId_Course(
    user: User,
    course: string,
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        userId: user.userId,
        missionId: {
          course: course,
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
        userId: user.userId,
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
        userId: user.userId,
        learn: learn,
        missionId: {
          course: course,
        },
      },
    });
  }

  async findByUserIdAndMissionIdAndLearn(
    user: User,
    mission: MissionEntity,
    learn: boolean,
  ): Promise<UserMissionEntity | undefined> {
    return this.userMissionRepository.findOne({
      where: {
        userId: user.userId,
        missionId: mission.missionId,
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
        userId: user.userId,
        missionId: {
          id: In(missions),
        },
      },
    });
  }

  async findByMissionId_MissionIdIn(
    missionIds: string[],
  ): Promise<UserMissionEntity[]> {
    return this.userMissionRepository.find({
      where: {
        missionId: {
          id: In(missionIds),
        },
      },
    });
  }
}
