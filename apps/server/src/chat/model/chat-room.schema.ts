import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as moment from 'moment-timezone';

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

  @Prop({ default: () => moment.tz(Date.now(), 'Asia/Seoul').toDate() })
  createdAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
