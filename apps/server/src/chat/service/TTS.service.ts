import { Injectable } from '@nestjs/common';
import { ElevenLabs } from 'elevenlabs-js';
import { writeFile } from 'fs/promises';

@Injectable()
export class TTSService {
  private readonly xiApiKey: string = process.env.TTS_API_KEY; // 환경 변수에서 API 키를 가져옵니다.
  private static readonly SERVER_PATH =
    '/home/ubuntu/DoRun-DoRun/frontend/dist/pooh.wav'; // 고정 경로

  private elevenLabs: ElevenLabs;

  constructor() {
    this.elevenLabs = new ElevenLabs(this.xiApiKey);
  }

  async callExternalApi(text: string): Promise<void> {
    const modelId = 'eleven_turbo_v2';
    const voiceSettings = {
      stability: 0.5,
      similarity_boost: 0.9,
      style: 0.25,
      use_speaker_boost: true,
    };

    try {
      const audioStream = await this.elevenLabs.textToSpeech({
        text: text,
        model_id: modelId,
        voice_settings: voiceSettings,
      });

      await writeFile(TTSService.SERVER_PATH, audioStream, {
        encoding: 'binary',
      });
      console.log('Audio stream saved successfully.');
    } catch (error) {
      console.error('Request failed:', error);
    }
  }
}
