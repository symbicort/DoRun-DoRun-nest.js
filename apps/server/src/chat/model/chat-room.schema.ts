import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ collection: 'rooms', timestamps: true })
export class Room {
  @Prop({ required: true })
  userid: string;

  @Prop({ required: true })
  ai: string;

  @Prop({ type: [String], default: [] })
  messages: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
