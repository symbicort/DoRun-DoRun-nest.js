import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as moment from 'moment-timezone';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ collection: 'messages', timestamps: true })
export class Message {
  _id: Types.ObjectId;

  @Prop({ required: true })
  roomid: string;

  @Prop({ required: true })
  userid: string;

  @Prop({ required: true })
  ai: string;

  @Prop({ required: true })
  userSpeaking: boolean;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  grammarValid: boolean;

  @Prop()
  correctedContent?: string;

  @Prop({ default: () => moment.tz(Date.now(), 'Asia/Seoul').toDate() })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
