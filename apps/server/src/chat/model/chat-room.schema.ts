import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ collection: 'rooms', timestamps: true })
export class Room {
  _id: Types.ObjectId;

  @Prop({ required: true })
  userid: string;

  @Prop({ required: true })
  ai: string;

  @Prop({ type: [String], default: [] })
  messages: string[];

  createdAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
