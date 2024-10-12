import { Injectable } from '@nestjs/common';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { Value } from 'google-protobuf';
import * as fs from 'fs';
import { UserRepository } from 'src/user/repository/user.repository';
import { MissionRepository } from '../repository/mission.repository';
import { UserMissionEntity } from '../entity/userMission.entity';
import { UserService } from 'src/user/service/user.service';
import { AuthUserDto } from 'src/user/dto/user.dto';
import { MissionDto } from '../dto/mission.dto';
import { MissionEntity } from '../entity/mission.entity';

@Injectable()
export class MissionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly missionRepository: MissionRepository,
    private readonly userService: UserService,
  ) {}

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

    // 해당 미션 데이터 찾기
    const userMission =
      await this.missionRepository.findByUserIdAndMissionIdAndLearn(
        user,
        mission,
        false,
      );

    if (!userMission) {
      console.log('학습 정보와 일치하는 유저 데이터가 없습니다.');
      return;
    }
    userMission.learn = true;
    await this.missionRepository.saveUserMission(userMission);
  }

  // 채팅창 : 프론트로 문장 전송
  async getUncompletedMissionsForUser(
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

    // 학습 true, 사용 false 미션 가져오기
    const unusedMissions =
      await this.missionRepository.findByUserIdAndCompleteAndLearn(
        user,
        false,
        true,
      );

    if (unusedMissions.length === 0) {
      return [];
    }

    // 랜덤 3 개
    const shuffledMissions = unusedMissions.sort(() => 0.5 - Math.random());
    const limitedUnusedMissions = shuffledMissions.slice(0, 3);

    const result: MissionDto[] = [];

    for (const limitedUnusedMission of limitedUnusedMissions) {
      let userMissionDto: MissionDto;

      userMissionDto.missionId = limitedUnusedMission.mission.missionId;
      userMissionDto.mission = limitedUnusedMission.mission.mission;
      userMissionDto.meaning = limitedUnusedMission.mission.meaning;
      userMissionDto.complete = limitedUnusedMission.complete;

      result.push(userMissionDto);
    }

    console.log('결과 확인', result);

    return result;
  }

  // 채팅창 : 미션 문장 사용여부 판단 AI
  // https://cloud.google.com/vertex-ai/docs/start/client-libraries?hl=ko
  async textPrompt(data: string): Promise<string> {
    const prompt = this.makePrompt(data);
    const instance = `{ "prompt": "Check which expression from the missions the chat corresponds to and return the corresponding missionId(s) as an Array. (e.g. ['lv1_1', 'lv_2']) If no matching missions are found or if the chat sentence does not match the expression from any of the missions, return none in lower case.${prompt}"}`;
    const parameters =
      '{\n' +
      '  "temperature": 0.2,\n' +
      '  "maxOutputTokens": 256,\n' +
      '  "topP": 0.95,\n' +
      '  "topK": 1\n' +
      '}';
    const project = 'stately-fabric-435204-t1';
    const location = 'asia-northeast3';
    const publisher = 'google';
    const model = 'text-bison@002';

    // 인증 파일의 경로
    // const credentialsPath =
    ('/home/ubuntu/.config/gcloud/application_default_credentials.json');

    // 배포 시 수정
    const credentialsPath =
      '/Users/jeongwon/DoRun-DoRun-nest.js/apps/server/application_default_credentials.json';

    return await this.predictTextPrompt(
      instance,
      parameters,
      project,
      location,
      publisher,
      model,
      credentialsPath,
    );
  }

  makePrompt(data: string): string {
    try {
      const jsonData = JSON.parse(data);
      let prompt = '';
      for (const mission of jsonData.missions) {
        prompt += `missionId: ${mission.missionId}\n`;
        prompt += `mission: ${mission.mission}\n\n`;
      }
      prompt += `chat: ${jsonData.chat}`;
      return prompt;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async predictTextPrompt(
    instance: string,
    parameters: string,
    project: string,
    location: string,
    publisher: string,
    model: string,
    credentialsPath: string,
  ): Promise<string> {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    const predictionServiceClient = new PredictionServiceClient({
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
      credentials,
    });

    const endpointName = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

    const instanceValue = Value.fromJson(instance);
    const instances = [instanceValue];

    const parameterValue = Value.fromJson(parameters);

    const [response] = await predictionServiceClient.predict({
      endpoint: endpointName,
      instances,
      parameters: parameterValue,
    });

    for (const prediction of response.predictions) {
      if (prediction.structValue) {
        const predictionMap = prediction.structValue.fields;
        if (predictionMap.content) {
          return predictionMap.content.stringValue;
        }
      }
    }

    return null;
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
