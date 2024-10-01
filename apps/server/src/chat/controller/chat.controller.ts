import { Controller, Post, Body, Get, Res, Req, Cookie } from '@nestjs/common';
import { Response, Request } from 'express';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { TTSService } from './tts.service';
import { ChatDto } from './dto/chat.dto';
import { UserDto } from './dto/user.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly ttsService: TTSService,
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
      sendChatDto.userMsg = chatDto.messages.join(', '); // 배열을 문자열로 변환
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
}
