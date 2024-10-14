import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpException,
  Req,
  Res,
} from '@nestjs/common';
import { MissionService } from '../service/mission.service';
import { Request, Response } from 'express';
import { checkMissionDto, MissionDto } from '../dto/mission.dto';
import { PracticeService } from '../service/practice.service';

@Controller()
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly practiceService: PracticeService,
  ) {}

  @Post('course')
  async addUserMissionsForCourse(@Req() req: Request): Promise<void> {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    const { course } = req.body;

    await this.missionService.addUserMissionsForCourse(
      course,
      accessToken,
      refreshToken,
    );
  }

  @Get('learn')
  async getUnLearnMissionsForUser(
    @Query('course') course: string,
    @Req() req: Request,
  ): Promise<MissionDto[]> {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    console.log('토큰 받음', accessToken, refreshToken, course);

    return await this.missionService.getUnLearnMissionsForUser(
      course,
      accessToken,
      refreshToken,
    );
  }

  @Post('learned')
  async setLearnMissionsForUser(
    @Body() request: { mission_id: number },
    @Req() req: Request,
  ): Promise<void> {
    const { mission_id } = request;
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    console.log('learned API REQ', mission_id, accessToken, refreshToken);

    await this.missionService.setLearnMissionsForUser(
      accessToken,
      refreshToken,
      mission_id,
    );
  }

  @Get('missions')
  async getUncompletedMissionsForUser(
    @Req() req: Request,
  ): Promise<MissionDto[]> {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    return await this.missionService.getUncompletedMissionsForUser(
      accessToken,
      refreshToken,
    );
  }

  @Post('checkMission')
  async checkMission(@Body() postData: checkMissionDto): Promise<string> {
    console.log('Received data from client:', postData.missions.length);
    if (postData.missions.length === 0) {
      return;
    }
    const response = await this.missionService.textPrompt(
      JSON.stringify(postData),
    );
    return response;
  }

  @Post('missionComplete')
  async setMissionCompleteForUser(
    @Body() request: { missionId: string[] },
    @Req() req: Request,
  ): Promise<string> {
    try {
      const { missionId } = request;
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['refreshToken'];

      await this.missionService.setMissionCompleteForUser(
        accessToken,
        refreshToken,
        missionId,
      );
      return 'Learned missions marked successfully.';
    } catch (error) {
      throw new HttpException(
        'An error occurred while marking missions as learned.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('practice')
  async getPractice(
    @Query('expression') expression: string,
    @Query('meaning') meaning: string,
    @Query('level') level: number,
  ) {
    try {
      return await this.practiceService.getPractice(expression, meaning, level);
    } catch (error) {
      console.error(error);
    }
  }
}
