import { Model } from 'mongoose';
import { Room, RoomDocument } from '../model/chat-room.schema';
import { RoomDto } from '../dto/chat-room.dto';
export declare class RoomService {
    private readonly roomModel;
    constructor(roomModel: Model<RoomDocument>);
    findAllByUserid(userid: string): Promise<RoomDto[]>;
    newRoom(room: Room): Promise<Room>;
}
