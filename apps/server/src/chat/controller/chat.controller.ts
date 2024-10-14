import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { STTService } from '../service/STT.service';
import { ChatService } from '../service/chat.service';
import { UserService } from 'src/user/service/user.service';
import { TTSService } from '../service/TTS.service';
import { ChatDto } from '../dto/chat.dto';
import { SendChatDto } from 'src/user/dto/user.dto';
import { Request } from 'express';

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
    @Req() req: Request,
    @Body() chatDto: ChatDto,
  ): Promise<SendChatDto> {
    const sendChatDto = new SendChatDto();

    try {
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['refreshToken'];

      const authUser = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      chatDto.messages = chatDto.messages;

      const getAnswerDto = await this.chatService.getAnswer(chatDto);

      await this.ttsService.callExternalApi(getAnswerDto.aiMsg);

      sendChatDto.aimsg = getAnswerDto.aiMsg;
      sendChatDto.result = true;
      sendChatDto.userMsg = chatDto.messages.join(', ');
      sendChatDto.emotion = getAnswerDto.emotion.split('\n')[0];

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
