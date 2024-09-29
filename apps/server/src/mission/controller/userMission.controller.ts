import { Controller, Post, Get, Body, Query, Cookie, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UserMissionService } from '../service/user-mission.service';
import { UserMissionDto } from '../dto/user-mission.dto';

@Controller('course')
export class UserMissionController {
    constructor(private readonly userMissionService: UserMissionService) {}

    @Post()
    async addUserMissionsForCourse(
        @Body() request: { course: string },
        @Cookie('accessToken') accessToken?: string,
        @Cookie('RefreshToken') refreshToken?: string,
    ): Promise<void> {
        const { course } = request;
        await this.userMissionService.addUserMissionsForCourse(course, accessToken, refreshToken);
    }

    @Get('learn')
    async getUnLearnMissionsForUser(
        @Query('course') course: string,
        @Cookie('accessToken') accessToken?: string,
        @Cookie('RefreshToken') refreshToken?: string,
    ): Promise<UserMissionDto[]> {
        return this.userMissionService.getUnLearnMissionsForUser(course, accessToken, refreshToken);
    }

    @Post('learned')
    async setLearnMissionsForUser(
        @Body() request: { mission_id: string },
        @Cookie('accessToken') accessToken?: string,
        @Cookie('RefreshToken') refreshToken?: string,
    ): Promise<void> {
        const { mission_id } = request;
        await this.userMissionService.setLearnMissionsForUser(accessToken, refreshToken, mission_id);
    }

    @Get('missions')
    async getUncompletedMissionsForUser(
        @Cookie('accessToken') accessToken?: string,
        @Cookie('RefreshToken') refreshToken?: string,
    ): Promise<UserMissionDto[]> {
        return this.userMissionService.getUncompletedMissionsForUser(accessToken, refreshToken);
    }

    @Post('checkMission')
    async checkMission(@Body() postData: string): Promise<string> {
        console.log('Received data from client:', postData);
        const response = await this.userMissionService.textPrompt(postData);
        return response;
    }

    @Post('missionComplete')
    async setMissionCompleteForUser(
        @Body() request: { missionId: string[] },
        @Cookie('accessToken') accessToken?: string,
        @Cookie('RefreshToken') refreshToken?: string,
    ): Promise<string> {
        try {
            const { missionId } = request;
            await this.userMissionService.setMissionCompleteForUser(accessToken, refreshToken, missionId);
            return 'Learned missions marked successfully.';
        } catch (error) {
            throw new HttpException('An error occurred while marking missions as learned.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('testComplete')
    async completeMissions(@Body() requestBody: { missionId: string[] }): Promise<string> {
        const { missionId } = requestBody;
        await this.userMissionService.updateMissions(missionId);
        return 'Missions completed successfully.';
    }
}
