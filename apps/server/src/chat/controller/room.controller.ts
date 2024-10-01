import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Cookies,
} from '@nestjs/common';
import { Response } from 'express';
import { RoomService } from './room.service';
import { UserService } from './user.service';
import { MessageService } from './message.service';
import { Room } from './entities/room.entity';
import { RoomDto } from './dto/room.dto';
import { UserDto } from './dto/user.dto';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @Get('getRooms')
  async getRooms(
    @Cookies('accessToken') accessToken: string,
    @Cookies('RefreshToken') refreshToken: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const authUser: UserDto.AuthuserDto = await this.userService.authuser(
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
    @Cookies('accessToken') accessToken: string,
    @Cookies('RefreshToken') refreshToken: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const authUser: UserDto.AuthuserDto = await this.userService.authuser(
        accessToken,
        refreshToken,
      );
      room.userId = authUser.userId; // Assuming Room entity has a userId property
      const newRoom: Room = await this.roomService.newRoom(room);
      await this.messageService.addMessagesByRoomId(room, room.messages);
      return res.json({ id: newRoom.id });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error occurred while creating a new room' });
    }
  }
}
