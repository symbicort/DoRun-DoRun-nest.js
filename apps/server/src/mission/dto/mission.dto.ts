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

export class getPracticeDto {
  expression: string;
  meaning: string;
  level: number;
}

export class getPracticeResDto {
  id: string;
  no: number;
  sentence: string;
  sentence_translation: string;
  similar: string[];
  similar_translation: string[];
  dialogue: string[];
  dialogue_translation: string[];
  used: boolean;
}

export class checkMissionDto {
  missions: string[];
  chat: string;
}
