import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../model/chat-room.schema';
import { RoomDto } from '../dto/chat-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async findAllByUserid(userid: string): Promise<RoomDto[]> {
    const rooms = await this.roomModel.find({ userid }).exec();
    return rooms.map((room) => ({
      id: room._id.toString(),
      userid: room.userid,
      ai: room.ai,
      createdAt: room.createdAt,
    }));
  }

  async newRoom(room: Room): Promise<Room> {
    const createdRoom = new this.roomModel(room);
    return await createdRoom.save();
  }
}
