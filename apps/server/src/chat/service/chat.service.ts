import { Injectable } from '@nestjs/common';
import { ChatDto } from './chat.dto';
import { WebClient } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

@Injectable()
export class ChatService {
  private readonly chatAuthClientUrl: string;
  private readonly textAuthClientUrl: string;

  constructor() {
    this.chatAuthClientUrl =
      'https://asia-northeast3-aiplatform.googleapis.com/v1/projects/stately-fabric-435204-t1/locations/asia-northeast3/publishers/google/models/chat-bison:predict';
    this.textAuthClientUrl =
      'https://asia-northeast3-aiplatform.googleapis.com/v1/projects/stately-fabric-435204-t1/locations/asia-northeast3/publishers/google/models/text-bison-32k:predict';
  }

  // Method to get authentication token
  private async getAuthToken(): Promise<string> {
    const auth = new GoogleAuth({
      keyFile:
        '/home/ubuntu/.config/gcloud/application_default_credentials.json', // Update path for server
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token;
  }

  // API to get the character's response
  async getAnswer(chatDto: ChatDto): Promise<ChatDto> {
    const messages = chatDto.messages;
    const msgQuery = this.makeMessagesQuery(messages);

    const requestBody = {
      instances: [
        {
          context: chatDto.context,
          messages: [msgQuery],
        },
      ],
      parameters: {
        temperature: 0.3,
        maxOutputTokens: 200,
        topP: 0.8,
        topK: 40,
      },
    };

    const authToken = await this.getAuthToken();
    const response = await this.sendRequest(
      this.chatAuthClientUrl,
      requestBody,
      authToken,
    );
    const content = this.extractContentOnly(response, 'chat');

    const [aiMsg, emotion] = content.split(',, ');
    chatDto.aiMsg = aiMsg;
    chatDto.emotion = emotion;

    return chatDto;
  }

  // API to get text correction
  async getCorrection(chatDto: ChatDto): Promise<string[]> {
    const messages = chatDto.messages;
    const stringifiedMessages = this.stringifyMessage(messages);

    const requestBody = {
      instances: [
        {
          content: chatDto.context + stringifiedMessages,
        },
      ],
      parameters: {
        maxOutputTokens: 8192,
        temperature: 0.5,
        topP: 1,
      },
    };

    const authToken = await this.getAuthToken();
    const response = await this.sendRequest(
      this.textAuthClientUrl,
      requestBody,
      authToken,
    );
    const content = this.extractContentOnly(response, 'text');

    return content.split('\n');
  }

  // Method to send request to the API
  private async sendRequest(
    url: string,
    requestBody: any,
    authToken: string,
  ): Promise<any> {
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending request:', error);
      throw new Error('API request failed');
    }
  }

  // Extract the content from the API response
  private extractContentOnly(response: any, responseForm: string): string {
    const predictions = response.predictions[0];
    if (responseForm === 'chat') {
      return predictions.candidates[0].content;
    } else {
      return predictions.content;
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
