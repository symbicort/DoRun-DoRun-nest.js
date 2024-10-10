import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from 'src/user/service/user.service';
import { RoomService } from '../service/chat-room.service';
import { MessageService } from '../service/chat-message.service';
import { RoomDto } from '../dto/chat-room.dto';
import { AuthUserDto } from 'src/user/dto/user.dto';
import { Room } from '../model/chat-room.schema';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @Get('getRooms')
  async getRooms(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['refreshToken'];

      const authUser: AuthUserDto = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      const roomDtos: RoomDto[] = await this.roomService.findAllByUserid(
        authUser.userId,
      );

      return res.json(roomDtos);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error occurred while retrieving rooms' });
    }
  }

  @Post('newRoom')
  async newRoom(
    @Body() room: Room,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['RefreshToken'];

      const authUser: AuthUserDto = await this.userService.authuser(
        accessToken,
        refreshToken,
      );
      room.userid = authUser.userId;
      const newRoom: Room = await this.roomService.newRoom(room);
      await this.messageService.addMessagesByRoomId(room, room.messages);
      return res.json({ id: newRoom._id });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error occurred while creating a new room' });
    }
  }
}
