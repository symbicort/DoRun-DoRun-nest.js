import { HydratedDocument, Types } from 'mongoose';
export type RoomDocument = HydratedDocument<Room>;
export declare class Room {
    _id: Types.ObjectId;
    userid: string;
    ai: string;
    messages: string[];
    createdAt: Date;
}
export declare const RoomSchema: import("mongoose").Schema<Room, import("mongoose").Model<Room, any, any, any, import("mongoose").Document<unknown, any, Room> & Room & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Room, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Room>> & import("mongoose").FlatRecord<Room> & Required<{
    _id: Types.ObjectId;
}>>;
