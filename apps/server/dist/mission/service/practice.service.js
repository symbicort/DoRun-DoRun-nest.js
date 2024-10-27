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
exports.PracticeService = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../../chat/service/chat.service");
const practice_context_1 = require("../../constants/practice-context");
const crypto_1 = require("crypto");
const mission_dto_1 = require("../dto/mission.dto");
let PracticeService = class PracticeService {
    constructor(chatService, practiceContext) {
        this.chatService = chatService;
        this.practiceContext = practiceContext;
    }
    async getPractice(expression, meaning, level) {
        try {
            const topic = this.pickTopic();
            const requestBody = JSON.stringify({
                instances: [
                    {
                        content: `${this.practiceContext.common_context1}${topic}${this.practiceContext.common_context2}${topic}${this.practiceContext.common_context3}${expression}`,
                    },
                ],
                parameters: { maxOutputTokens: 8192, temperature: 0.7, topP: 1 },
            });
            const response = await this.chatService.sendTextRequest(requestBody);
            const example = response.candidates[0].content.parts[0].text;
            return await this.makeCustomizedJsonForm(example, expression, meaning, level);
        }
        catch (e) {
            console.error(e);
        }
    }
    async makeCustomizedJsonForm(example, expression, meaning, level) {
        try {
            const resultSplit = example.split(',, ');
            const responseBody = new mission_dto_1.getPracticeResDto();
            responseBody.id = `level${level}`;
            responseBody.no = level;
            responseBody.sentence = `(레벨${level})${expression}`;
            responseBody.sentence_translation = meaning;
            const similars = new Array(3);
            const similars_trans = new Array(3);
            for (let i = 0; i < 3; i++) {
                const temp = resultSplit[i].split('(');
                similars[i] = temp[0];
                similars_trans[i] = temp[1].slice(0, -1);
            }
            responseBody.similar = similars;
            responseBody.similar_translation = similars_trans;
            const dialogue = new Array(2);
            const dialogue_translation = new Array(2);
            let temp = resultSplit[3].split('(');
            dialogue[0] = temp[0];
            dialogue_translation[0] = `A: ${temp[1].slice(0, -1)}`;
            temp = resultSplit[4].split('(');
            dialogue[1] = temp[0];
            dialogue_translation[1] = `B: ${temp[1].slice(0, -1)}`;
            responseBody.dialogue = dialogue;
            responseBody.dialogue_translation = dialogue_translation;
            responseBody.used = false;
            return responseBody;
        }
        catch (e) {
            console.error(e);
        }
    }
    pickTopic() {
        const randomNumber = (0, crypto_1.randomInt)(0, 10);
        const topics = [
            this.practiceContext.topic0,
            this.practiceContext.topic1,
            this.practiceContext.topic2,
            this.practiceContext.topic3,
            this.practiceContext.topic4,
            this.practiceContext.topic5,
            this.practiceContext.topic6,
            this.practiceContext.topic7,
            this.practiceContext.topic8,
            this.practiceContext.topic9,
        ];
        return topics[randomNumber];
    }
};
exports.PracticeService = PracticeService;
exports.PracticeService = PracticeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        practice_context_1.PracticeContext])
], PracticeService);
//# sourceMappingURL=practice.service.js.map