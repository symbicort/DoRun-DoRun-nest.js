import { HydratedDocument, Types } from 'mongoose';
export type MessageDocument = HydratedDocument<Message>;
export declare class Message {
    _id: Types.ObjectId;
    roomid: string;
    userid: string;
    ai: string;
    userSpeaking: boolean;
    content: string;
    grammarValid: boolean;
    correctedContent?: string;
    createdAt: Date;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, import("mongoose").Document<unknown, any, Message> & Message & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & Required<{
    _id: Types.ObjectId;
}>>;
