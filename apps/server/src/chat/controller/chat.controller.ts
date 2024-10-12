import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { STTService } from '../service/STT.service';
import { ChatService } from '../service/chat.service';
import { UserService } from 'src/user/service/user.service';
import { TTSService } from '../service/TTS.service';
import { ChatDto } from '../dto/chat.dto';
import { SendChatDto } from 'src/user/dto/user.dto';

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
    @Request() req,
    @Body() chatDto: ChatDto,
  ): Promise<SendChatDto> {
    const sendChatDto = new SendChatDto();

    try {
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['refreshToken'];

      console.log('sendChat 토큰 확인', accessToken, refreshToken);

      const authUser = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      chatDto.messages = chatDto.messages;

      const getAnswerDto = await this.chatService.getAnswer(chatDto);

      console.log('푸 답변', getAnswerDto.aiMsg);

      await this.ttsService.callExternalApi(getAnswerDto.aiMsg);

      sendChatDto.Aimsg = getAnswerDto.aiMsg;
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
