"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const vertexai_1 = require("@google-cloud/vertexai");
const correct_context_1 = require("../../constants/correct-context");
const pooh_context_1 = require("../../constants/pooh-context");
let ChatService = class ChatService {
    constructor() {
        this.model = 'gemini-1.5-pro-001';
        this.vertex_ai = new vertexai_1.VertexAI({
            project: 'augmented-voice-443414-c8',
            location: 'asia-northeast3',
        });
        this.chatModel = this.vertex_ai.preview.getGenerativeModel({
            model: this.model,
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.3,
                topP: 0.8,
                topK: 40,
            },
        });
        this.textModel = this.vertex_ai.preview.getGenerativeModel({
            model: this.model,
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.5,
                topP: 1,
            },
        });
    }
    async getAnswer(chatDto) {
        const messages = chatDto.messages;
        const msgQuery = this.makeMessagesQuery(messages);
        const request_message = {
            context: pooh_context_1.Pooh.contextSet(),
            messages: [msgQuery],
        };
        const response = await this.sendChatRequest(request_message);
        const content = response.candidates[0].content.parts[0].text;
        const [aiMsg, emotion] = content.split(',, ');
        chatDto.aiMsg = aiMsg;
        chatDto.emotion = emotion;
        return chatDto;
    }
    async getCorrection(chatDto) {
        const stringifiedMessages = this.stringifyMessage(chatDto.messages);
        const request_message = {
            content: correct_context_1.CorrectContext.context + stringifiedMessages,
        };
        const response = await this.sendTextRequest(request_message);
        const content = response.candidates[0].content.parts[0].text.split('\n');
        content.pop();
        return content;
    }
    async sendChatRequest(request_message) {
        const chat = this.chatModel.startChat({});
        const streamResult = await chat.sendMessageStream(JSON.stringify(request_message));
        return streamResult.response;
    }
    async sendTextRequest(request_message) {
        const chat = this.textModel.startChat({});
        const streamResult = await chat.sendMessageStream(JSON.stringify(request_message));
        return streamResult.response;
    }
    async extractContentOnly(response, responseForm) {
        const predictions = response.candidates[0];
        if (responseForm === 'chat') {
            return predictions.content;
        }
        else {
            return predictions.content;
        }
    }
    stringifyMessage(messages) {
        return messages.join('\n');
    }
    makeMessagesQuery(messages) {
        return messages
            .map((message) => {
            const messageType = message.charAt(0);
            const content = message.slice(6).replace(/"/g, '_');
            if (messageType === 'p') {
                return `{"author": "bot", "content": "${content}"}`;
            }
            else if (messageType === 'u') {
                return `{"author": "user", "content": "${content}"}`;
            }
            return '';
        })
            .join(',');
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChatService);
//# sourceMappingURL=chat.service.js.map