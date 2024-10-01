import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ collection: 'messages', timestamps: true })
export class Message {
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

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
