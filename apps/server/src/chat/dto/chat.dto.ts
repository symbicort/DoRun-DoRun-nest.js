import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChatDto {
  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsString()
  userMsg: string;

  @IsString()
  aiMsg: string;

  @IsArray()
  @IsString({ each: true })
  messages: string[];

  @IsBoolean()
  missionSuccess: boolean;

  @IsOptional()
  @IsInt()
  successNumber?: number;

  @IsOptional()
  @IsString()
  emotion?: string;
}
