import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from './message.service';
import { MessageDto } from '../chat-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('getMessagesByRoomid')
  async getMessagesByRoomid(
    @Query('roomid') roomid: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const messageDtos: MessageDto[] =
        await this.messageService.findByRoomid(roomid);
      return res.json(messageDtos);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error occurred while retrieving messages' });
    }
  }

  @Get('wrongMessages')
  async getWrongMessagesByRoomid(
    @Query('roomid') roomid: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const wrongMessagesDtos: MessageDto[] =
        await this.messageService.findByRoomidAndGrammarValidIsFalse(roomid);
      return res.json(wrongMessagesDtos);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error occurred while retrieving wrong messages' });
    }
  }
}
