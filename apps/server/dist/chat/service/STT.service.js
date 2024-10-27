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
exports.STTService = void 0;
const common_1 = require("@nestjs/common");
const speech_1 = require("@google-cloud/speech");
const speech_2 = require("@google-cloud/speech");
let STTService = class STTService {
    constructor() {
        this.speechClient = new speech_1.SpeechClient({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });
    }
    async speechToText(file) {
        const audioBytes = file.buffer.toString('base64');
        const request = {
            config: {
                encoding: speech_2.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
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
            transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
            return transcript;
        })
            .join(' ');
        return transcription;
    }
};
exports.STTService = STTService;
exports.STTService = STTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], STTService);
//# sourceMappingURL=STT.service.js.map