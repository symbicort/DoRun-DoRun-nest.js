import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  Cookie,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { TTSService } from './tts.service';
import { ChatDto } from './dto/chat.dto';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { STTService } from '../service/STT.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly ttsService: TTSService,
    private readonly sttService: STTService,
  ) {}

  @Post('getCorrection')
  async getCorrection(@Body() chatDto: ChatDto): Promise<string[]> {
    return this.chatService.getCorrection(chatDto);
  }

  @Post('sendChat')
  async sendChat(
    @Cookie('accessToken') accessToken: string,
    @Cookie('RefreshToken') refreshToken: string,
    @Body() chatDto: ChatDto,
  ): Promise<UserDto.SendChatDto> {
    const sendChatDto = UserDto.SendChatDto();

    try {
      console.log('sendChat 토큰 확인', accessToken, refreshToken);

      const authUser = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      chatDto.messages = chatDto.messages; // 메시지 설정

      const getAnswerDto = await this.chatService.getAnswer(chatDto);

      console.log('푸 답변', getAnswerDto.aiMsg);

      await this.ttsService.callExternalApi(getAnswerDto.aiMsg);

      sendChatDto.aimsg = getAnswerDto.aiMsg;
      sendChatDto.result = true;
      sendChatDto.userMsg = chatDto.messages.join(', ');
      sendChatDto.emotion = getAnswerDto.emotion;

      if (!authUser.result) {
        return sendChatDto;
      } else {
        sendChatDto.nickname = authUser.nickname;
        return sendChatDto;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Post('speech')
  @UseInterceptors(FileInterceptor('audio'))
  async stt(@UploadedFile() audioFile: Express.Multer.File): Promise<string> {
    if (!audioFile) {
      throw new BadRequestException('No audio file provided');
    }

    try {
      return await this.sttService.speechToText(audioFile);
    } catch (error) {
      throw new BadRequestException(`STT failed: ${error.message}`);
    }
  }
}
