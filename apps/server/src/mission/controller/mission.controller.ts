import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpException,
  Res,
  Req,
} from '@nestjs/common';
import { MissionService } from '../service/mission.service';
import { MissionDto } from '../dto/mission.dto';
import { Request, Response } from 'express';
import { PracticeService } from '../service/practice.service';

@Controller()
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly practiceService: PracticeService,
  ) {}

  @Post('course')
  async addUserMissionsForCourse(
    @Body() request: { course: string },
    @Req() req: Request,
  ): Promise<void> {
    const { course } = request;
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['RefreshToken'];

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
    const refreshToken = req.cookies['RefreshToken'];

    return this.missionService.getUnLearnMissionsForUser(
      course,
      accessToken,
      refreshToken,
    );
  }

  @Post('learned')
  async setLearnMissionsForUser(
    @Body() request: { mission_id: string },
    @Req() req: Request,
  ): Promise<void> {
    const { mission_id } = request;
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['RefreshToken'];

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
    const refreshToken = req.cookies['RefreshToken'];

    return this.missionService.getUncompletedMissionsForUser(
      accessToken,
      refreshToken,
    );
  }

  @Post('checkMission')
  async checkMission(@Body() postData: string): Promise<string> {
    console.log('Received data from client:', postData);
    const response = await this.missionService.textPrompt(postData);
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
      const refreshToken = req.cookies['RefreshToken'];

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

  @Get('getPractice')
  async getPractice(
    @Query('expression') expression: string,
    @Query('meaning') meaning: string,
    @Query('level') level: number,
    @Res() res: Response,
  ) {
    try {
      const responseBody = await this.practiceService.getPractice(
        expression,
        meaning,
        level,
      );
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while fetching practice data.',
        error: error.message,
      });
    }
  }
}
