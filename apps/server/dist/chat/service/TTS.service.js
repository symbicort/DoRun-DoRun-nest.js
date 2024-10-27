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
exports.TTSService = void 0;
const common_1 = require("@nestjs/common");
const elevenlabs_1 = require("elevenlabs");
const promises_1 = require("fs/promises");
let TTSService = class TTSService {
    constructor() {
        this.xiApiKey = process.env.TTS_API_KEY;
        this.voice_ID = process.env.TTS_VOICE_ID;
        this.SERVER_PATH = '/home/ubuntu/DoRun-DoRun-nest.js/apps/client/dist/pooh.mp3';
        this.LOCAL_PATH = '/Users/jeongwon/DoRun-DoRun-nest.js/apps/client/public/pooh.mp3';
        this.client = new elevenlabs_1.ElevenLabsClient({ apiKey: this.xiApiKey });
    }
    async callExternalApi(text) {
        const voiceSettings = {
            stability: 0.5,
            similarity_boost: 0.9,
            style: 0.25,
            use_speaker_boost: true,
        };
        try {
            const audioStream = await this.client.textToSpeech.convert(this.voice_ID, {
                model_id: 'eleven_turbo_v2',
                text: text,
                voice_settings: voiceSettings,
                optimize_streaming_latency: elevenlabs_1.ElevenLabs.OptimizeStreamingLatency.One,
                output_format: elevenlabs_1.ElevenLabs.OutputFormat.Mp344100128,
            });
            await (0, promises_1.writeFile)(this.SERVER_PATH, audioStream, {
                encoding: 'binary',
            });
            console.log('Audio stream saved successfully.');
        }
        catch (error) {
            console.error('TTS Convert failed', error.message);
        }
    }
};
exports.TTSService = TTSService;
exports.TTSService = TTSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TTSService);
//# sourceMappingURL=TTS.service.js.map