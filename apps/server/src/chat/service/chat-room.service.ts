import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './room.schema'; // Room 스키마 경로
import { RoomDto } from './room.dto'; // RoomDto 경로

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async findAllByUserid(userid: string): Promise<RoomDto[]> {
    const rooms = await this.roomModel.find({ userid }).exec();
    return rooms.map((room) => ({
      id: room._id.toString(), // Mongoose의 _id를 문자열로 변환
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
