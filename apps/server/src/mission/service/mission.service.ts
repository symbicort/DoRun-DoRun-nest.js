import { Injectable } from '@nestjs/common';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
// import { Value } from '@google-cloud/aiplatform/build/protos/google/protobuf/struct_pb';
import * as fs from 'fs';
import { UserRepository } from 'src/user/repository/user.repository';
import { MissionRepository } from '../repository/mission.repository';
import { UserMissionEntity } from '../entity/userMission.entity';
import { UserService } from 'src/user/service/user.service';
import { ChatService } from 'src/chat/service/chat.service';
import { AuthUserDto } from 'src/user/dto/user.dto';
import { MissionDto } from '../dto/mission.dto';
import { MissionEntity } from '../entity/mission.entity';

@Injectable()
export class MissionService {
  private readonly client: PredictionServiceClient;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly missionRepository: MissionRepository,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {
    this.client = new PredictionServiceClient({
      projectId: 'stately-fabric-435204-t1',
      // 배포 시 243번째 줄 경로로 수정
      keyFilename:
        '/Users/jeongwon/DoRun-DoRun-nest.js/apps/server/application_default_credentials.json',
    });
  }

  // 학습하기 : course 선택 -> user_mission 테이블에 데이터 추가
  async addUserMissionsForCourse(
    course: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      const authuserDto: AuthUserDto = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      if (!authuserDto.result) {
        return;
      }

      const courseMission: MissionEntity[] =
        await this.missionRepository.findByCourse(course);

      // user 찾기
      const userId = authuserDto.userId;
      const user = await this.userRepository.findByUserId(userId);

      // 이미 존재하는 미션인지 확인
      const existingMissions =
        await this.missionRepository.findByUserIdAndMissionId_Course(
          user,
          courseMission,
        );

      if (existingMissions.length > 0) {
        // 이미 해당 코스에 대한 미션 데이터가 있으면 더 이상 진행하지 않음
        return;
      }

      for (const mission of courseMission) {
        const userMission = new UserMissionEntity();

        userMission.user = user;
        userMission.mission = mission;
        userMission.complete = false;
        userMission.learn = false;

        await this.missionRepository.saveUserMission(userMission);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 학습하기 : 프론트로 문장 전송
  async getUnLearnMissionsForUser(
    course: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<MissionDto[]> {
    const authuserDto: AuthUserDto = await this.userService.authuser(
      accessToken,
      refreshToken,
    );
    if (!authuserDto.result) {
      return [];
    }
    // user 찾기
    const userId = authuserDto.userId;
    const user = await this.userRepository.findByUserId(userId);

    // 학습 false 미션 가져오기
    const unLearnMissions =
      await this.missionRepository.findByUserIdAndUnLearnAndMissionId_Course(
        user,
        false,
        course,
      );

    if (unLearnMissions.length === 0) {
      return [];
    }

    // 랜덤 3 개
    const shuffledMissions = unLearnMissions.sort(() => 0.5 - Math.random());
    const limitedUnlearnMissions = shuffledMissions.slice(0, 3);

    const result: MissionDto[] = [];

    for (const limitedUnlearnMission of limitedUnlearnMissions) {
      const userMissionDto = new MissionDto();

      userMissionDto.missionId = limitedUnlearnMission.mission.missionId;
      userMissionDto.mission = limitedUnlearnMission.mission.mission;
      userMissionDto.meaning = limitedUnlearnMission.mission.meaning;
      userMissionDto.complete = limitedUnlearnMission.complete;

      result.push(userMissionDto);
    }
    return result;
  }

  // 학습하기 : 학습 완료
  async setLearnMissionsForUser(
    accessToken: string,
    refreshToken: string,
    missionId: number,
  ): Promise<void> {
    try {
      const authuserDto: AuthUserDto = await this.userService.authuser(
        accessToken,
        refreshToken,
      );
      if (!authuserDto.result) {
        return;
      }

      // user 찾기
      const userId = authuserDto.userId;
      const user = await this.userRepository.findByUserId(userId);

      // missionId 찾기
      const mission = await this.missionRepository.findByMissionId(missionId);

      console.log('검색 조건', user, mission);

      // 해당 미션 데이터 찾기
      const userMission =
        await this.missionRepository.findByUserIdAndMissionIdAndLearn(
          user,
          mission,
          false,
        );

      console.log('미션 데이터 find 결과', userMission);

      if (!userMission) {
        console.log('학습 정보와 일치하는 유저 데이터가 없습니다.');
        return;
      }
      userMission.learn = true;
      await this.missionRepository.saveUserMission(userMission);
    } catch (e) {
      console.error(e);
    }
  }

  // 채팅창 : 프론트로 문장 전송
  async getUncompletedMissionsForUser(
    accessToken: string,
    refreshToken: string,
  ): Promise<MissionDto[]> {
    try {
      const authuserDto: AuthUserDto = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      if (!authuserDto.result) {
        return [];
      }

      // user 찾기
      const userId = authuserDto.userId;
      const user = await this.userRepository.findByUserId(userId);

      // 학습 true, 사용 false 미션 가져오기
      const unusedMissions =
        await this.missionRepository.findByUserIdAndCompleteAndLearn(
          user,
          false,
          true,
        );

      console.log('안배운 미션 확인', unusedMissions[0].mission.missionId);

      if (unusedMissions.length === 0) {
        return [];
      }

      // 랜덤 3 개
      const shuffledMissions = unusedMissions.sort(() => 0.5 - Math.random());
      const limitedUnusedMissions = shuffledMissions.slice(0, 3);

      const result: MissionDto[] = [];

      for (const limitedUnusedMission of limitedUnusedMissions) {
        const userMissionDto = new MissionDto();

        userMissionDto.missionId = limitedUnusedMission.mission.missionId;
        userMissionDto.mission = limitedUnusedMission.mission.mission;
        userMissionDto.meaning = limitedUnusedMission.mission.meaning;
        userMissionDto.complete = limitedUnusedMission.complete;

        result.push(userMissionDto);
      }

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  // 채팅창 : 미션 문장 사용여부 판단 AI
  // https://cloud.google.com/vertex-ai/docs/start/client-libraries?hl=ko
  async textPrompt(data: string): Promise<string> {
    const prompt = await this.makePrompt(data);
    const request_message = `{ "prompt": "Check which expression from the missions the chat corresponds to and return the corresponding missionId(s) as an Array. (e.g. ['lv1_1', 'lv_2']) If no matching missions are found or if the chat sentence does not match the expression from any of the missions, return none in lower case.",${prompt}}`;

    const response = await this.chatService.sendTextRequest(request_message);

    return response.candidates[0].content.parts[0].text;
  }

  async makePrompt(data: string): Promise<string> {
    try {
      const jsonData = JSON.parse(data);
      let prompt = '';
      for (const mission of jsonData.missions) {
        prompt += `"missionId": ${mission.missionId}\n,`;
        prompt += `"mission": "${mission.mission}"\n\n,`;
      }
      prompt += `"chat": "${jsonData.chat}"`;
      return prompt;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async predictTextPrompt(
    request_message: string,
    parameters: string,
    project: string,
    location: string,
  ): Promise<string> {
    try {
      console.log('value.json', request_message, typeof request_message);

      const endpointName = `projects/${project}/locations/${location}/publishers/google/models/text-bison@002`;

      const check = await this.chatService.sendTextRequest(request_message);

      console.log(
        '미션 성공 여부 방법 변경',
        check.candidates[0].content.parts[0].text,
      );

      // const instanceValue = JSON.parse(instance);
      // const instances = [instanceValue];

      // const parameterValue = JSON.parse(parameters);

      // const [response] = await this.client.predict({
      //   endpoint: endpointName,
      //   instances,
      //   parameters: parameterValue,
      // });

      // for (const prediction of response.predictions) {
      //   if (prediction.structValue) {
      //     const predictionMap = prediction.structValue.fields;
      //     if (predictionMap.content) {
      //       return predictionMap.content.stringValue;
      //     }
      //   }
      // }

      return null;
    } catch (err) {
      console.error('predictTextPrompt', err);
    }
  }

  // 채팅창 : 미션 완료(대화 종료)
  async setMissionCompleteForUser(
    accessToken: string,
    refreshToken: string,
    missionIds: string[],
  ): Promise<void> {
    const authuserDto: AuthUserDto = await this.userService.authuser(
      accessToken,
      refreshToken,
    );
    if (!authuserDto.result) {
      return;
    }

    // user 찾기
    const userId = authuserDto.userId;
    const user = await this.userRepository.findByUserId(userId);

    if (user) {
      // 사용자와 미션 ID 목록을 기반으로 데이터 찾기
      const userMissions =
        await this.missionRepository.findByUserIdAndMissionId_MissionIdIn(
          user,
          missionIds,
        );
      for (const userMission of userMissions) {
        userMission.complete = true;
        await this.missionRepository.saveUserMission(userMission);
      }
    }
  }

  // async updateMissions(missionIds: string[]): Promise<void> {
  //   const userMissions =
  //     await this.userMissionRepository.findByMissionId_MissionIdIn(missionIds);
  //   for (const userMission of userMissions) {
  //     userMission.complete = true;
  //   }
  //   await this.missionRepository.saveMission(userMissions);
  // }
}
