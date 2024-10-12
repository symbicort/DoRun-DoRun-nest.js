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
    return await this.missionRepository.find({ where: { course } });
  }

  // missionId로 mission 찾기
  async findByMissionId(missionId: number): Promise<MissionEntity | undefined> {
    return await this.missionRepository.findOne({ where: { missionId } });
  }

  // missionId 리스트에 해당하는 mission 찾기
  async findByMissionIdIn(missionIds: number[]): Promise<MissionEntity[]> {
    return await this.missionRepository.find({
      where: { missionId: In(missionIds) },
    });
  }

  async saveUserMission(
    userMission: UserMissionEntity,
  ): Promise<UserMissionEntity> {
    return await this.userMissionRepository.save(userMission);
  }

  // 초기 미션 생성?
  async saveMission(mission: MissionEntity): Promise<MissionEntity> {
    return await this.missionRepository.save(mission);
  }

  async findByUserIdAndMissionId_Course(
    user: User,
    courseMission: MissionEntity[],
  ): Promise<UserMissionEntity[]> {
    const missions: number[] = courseMission.map(
      (mission) => mission.missionId,
    );

    return await this.userMissionRepository.find({
      where: {
        user: {
          userId: user.userId,
        },
        mission: {
          missionId: In(missions),
        },
      },
    });
  }

  async findByUserIdAndCompleteAndLearn(
    user: User,
    complete: boolean,
    learn: boolean,
  ): Promise<UserMissionEntity[]> {
    return await this.userMissionRepository.find({
      where: {
        user: user,
        complete: complete,
        learn: learn,
      },
    });
  }

  async findByUserIdAndUnLearnAndMissionId_Course(
    user: User,
    learn: boolean,
    course: string,
  ): Promise<UserMissionEntity[]> {
    return await this.userMissionRepository.find({
      relations: ['mission'],
      where: {
        user: {
          userId: user.userId,
        }, // User 객체 사용
        learn: learn,
        mission: {
          course: course,
        },
      },
    });
  }

  async findByUserIdAndMissionIdAndLearn(
    user: User,
    mission: MissionEntity,
    learn: boolean,
  ): Promise<UserMissionEntity> {
    return await this.userMissionRepository.findOne({
      where: {
        user: user, // User 객체 사용
        mission: mission, // MissionEntity 객체 사용
        learn: learn,
      },
    });
  }

  async findByUserIdAndMissionId_MissionIdIn(
    user: User,
    missions: string[],
  ): Promise<UserMissionEntity[]> {
    return await this.userMissionRepository.find({
      where: {
        user: user,
        mission: In(missions),
      },
    });
  }

  async findByMissionId_MissionIdIn(
    missionIds: string[],
  ): Promise<UserMissionEntity[]> {
    return await this.userMissionRepository.find({
      where: {
        mission: In(missionIds),
      },
    });
  }
}
