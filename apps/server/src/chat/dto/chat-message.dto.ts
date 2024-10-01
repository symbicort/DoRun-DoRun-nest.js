import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  roomid: string;

  @IsNotEmpty()
  @IsString()
  userid: string;

  @IsNotEmpty()
  @IsString()
  ai: string;

  @IsNotEmpty()
  @IsBoolean()
  userSpeaking: boolean;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  grammarValid: boolean;

  @IsNotEmpty()
  @IsString()
  correctedContent: string;

  @Type(() => Date)
  createdAt: Date;
}
