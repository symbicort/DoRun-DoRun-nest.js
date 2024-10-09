import { IsString, IsBoolean } from 'class-validator';

export class MissionDto {
  @IsString()
  missionId: number;

  @IsString()
  mission: string;

  @IsString()
  meaning: string;

  @IsBoolean()
  complete: boolean;
}
