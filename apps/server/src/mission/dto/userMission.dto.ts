import { IsString, IsBoolean } from 'class-validator';

export class userMissionDto {
  @IsString()
  missionId: string;

  @IsString()
  mission: string;

  @IsString()
  meaning: string;

  @IsBoolean()
  complete: boolean;
}
