import { Injectable } from '@nestjs/common';
import { VertexAI, GenerativeModelPreview } from '@google-cloud/vertexai';
import { ChatDto } from '../dto/chat.dto';
import { CorrectContext } from 'src/constants/correct-context';
import { Pooh } from 'src/constants/pooh-context';

@Injectable()
export class ChatService {
  private readonly model: string;
  private readonly vertex_ai: VertexAI;
  private readonly chatModel: GenerativeModelPreview;
  private readonly textModel: GenerativeModelPreview;

  constructor() {
    this.model = 'gemini-1.5-pro-001';

    // VertexAI 인스턴스 생성
    this.vertex_ai = new VertexAI({
      project: 'stately-fabric-435204-t1',
      location: 'asia-northeast3',
    });

    // 채팅 모델 인스턴스 생성
    this.chatModel = this.vertex_ai.preview.getGenerativeModel({
      model: this.model,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
      },
    });

    // 텍스트 수정 모델 인스턴스 생성
    this.textModel = this.vertex_ai.preview.getGenerativeModel({
      model: this.model,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.5,
        topP: 1,
      },
    });
  }

  // API to get the character's response
  async getAnswer(chatDto: ChatDto): Promise<ChatDto> {
    const messages = chatDto.messages;
    const msgQuery = this.makeMessagesQuery(messages);

    const request_message = {
      context: Pooh.contextSet(),
      messages: [msgQuery],
    };

    const response = await this.sendChatRequest(request_message);

    const content = response.candidates[0].content.parts[0].text;

    const [aiMsg, emotion] = content.split(',, ');
    chatDto.aiMsg = aiMsg;
    chatDto.emotion = emotion;

    return chatDto;
  }

  // API to get text correction
  async getCorrection(chatDto: ChatDto): Promise<string[]> {
    const messages = chatDto.messages;
    const stringifiedMessages = this.stringifyMessage(messages);

    const request_message = {
      content: CorrectContext + stringifiedMessages,
    };

    const response = await this.sendTextRequest(request_message);

    console.log('푸 답변', response);

    // const content = await this.extractContentOnly(response, 'text');

    return response.split('\n');
  }

  // Method to send chat request to the API
  async sendChatRequest(request_message: any): Promise<any> {
    const chat = this.chatModel.startChat({});
    const streamResult = await chat.sendMessageStream(
      JSON.stringify(request_message),
    );
    return streamResult.response;
  }

  // Method to send text correction request to the API
  async sendTextRequest(request_message: any): Promise<any> {
    const chat = this.textModel.startChat({});
    const streamResult = await chat.sendMessageStream(
      JSON.stringify(request_message),
    );
    return streamResult.response;
  }

  // Extract the content from the API response
  async extractContentOnly(
    response: any,
    responseForm: string,
  ): Promise<string> {
    const predictions = response.candidates[0];
    if (responseForm === 'chat') {
      return predictions.content; // 채팅 응답 추출
    } else {
      return predictions.content; // 텍스트 수정 응답 추출
    }
  }

  // Helper method to stringify messages
  private stringifyMessage(messages: string[]): string {
    return messages.join('\n');
  }

  // Helper method to format messages query
  private makeMessagesQuery(messages: string[]): string {
    return messages
      .map((message) => {
        const messageType = message.charAt(0); // 'p' or 'u'
        const content = message.slice(6).replace(/"/g, '_');
        if (messageType === 'p') {
          return `{"author": "bot", "content": "${content}"}`;
        } else if (messageType === 'u') {
          return `{"author": "user", "content": "${content}"}`;
        }
        return '';
      })
      .join(',');
  }
}
