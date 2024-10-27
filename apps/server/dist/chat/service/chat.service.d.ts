import { ChatDto } from '../dto/chat.dto';
export declare class ChatService {
    private readonly model;
    private readonly vertex_ai;
    private readonly chatModel;
    private readonly textModel;
    constructor();
    getAnswer(chatDto: ChatDto): Promise<ChatDto>;
    getCorrection(chatDto: ChatDto): Promise<string[]>;
    sendChatRequest(request_message: any): Promise<any>;
    sendTextRequest(request_message: any): Promise<any>;
    extractContentOnly(response: any, responseForm: string): Promise<string>;
    private stringifyMessage;
    private makeMessagesQuery;
}
