import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { protos } from '@google-cloud/speech';

@Injectable()
export class STTService {
  private speechClient: SpeechClient;

  constructor() {
    this.speechClient = new SpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async speechToText(file: Express.Multer.File): Promise<string> {
    const audioBytes = file.buffer.toString('base64');

    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      config: {
        encoding:
          protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
            .WEBM_OPUS,
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
      audio: {
        content: audioBytes,
      },
    };

    const [response] = await this.speechClient.recognize(request);
    const transcriptionResults = response.results;

    const transcription = transcriptionResults
      .map((result) => {
        let transcript = result.alternatives[0].transcript;
        // 첫 글자를 대문자로 변환
        transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
        return transcript;
      })
      .join(' ');

    return transcription;
  }
}
