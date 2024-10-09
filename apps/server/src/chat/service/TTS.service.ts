import { Injectable } from '@nestjs/common';
import { ElevenLabs, ElevenLabsClient } from 'elevenlabs';
import { writeFile } from 'fs/promises';

@Injectable()
export class TTSService {
  private readonly xiApiKey: string = process.env.TTS_API_KEY;
  private readonly voice_ID: string = process.env.TTS_VOICE_ID;
  private readonly SERVER_PATH =
    '/home/ubuntu/DoRun-DoRun-nest.js/frontend/dist/pooh.mp3';

  private client: ElevenLabsClient;

  constructor() {
    this.client = new ElevenLabsClient({ apiKey: this.xiApiKey});
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
      const audioStream = await this.client.textToSpeech.convert(this.voice_ID,{
        text: text,
        voice_settings: voiceSettings,
        optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.One,
        output_format: ElevenLabs.OutputFormat.Mp344100128
      });

      await writeFile(this.SERVER_PATH, audioStream, {
        encoding: 'binary',
      });
      console.log('Audio stream saved successfully.');
    } catch (error) {
      console.error('Request failed:', error);
    }
  }
}
