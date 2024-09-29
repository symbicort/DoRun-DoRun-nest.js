import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { PracticeContext } from 'src/constants/practice-context';
import { randomInt } from 'crypto';

@Injectable()
export class PracticeService {
    constructor(
        private readonly chatService: ChatService,
        private readonly practiceContext: PracticeContext,
    ) {}

    async getPractice(expression: string, meaning: string, level: number): Promise<Map<string, any>> {
        const topic = this.pickTopic(); // 랜덤으로 어떤 토픽의 예문을 받을지 고름
        const requestBody = JSON.stringify({
            instances: [{ content: `${this.practiceContext.common_context1}${topic}${this.practiceContext.common_context2}${topic}${this.practiceContext.common_context3}${expression}` }],
            parameters: { maxOutputTokens: 8192, temperature: 0.7, topP: 1 },
        });

        await this.chatService.createConnection(); // 예문 받기 전에 api 인증 만료됐는지 확인, 만료시 갱신
        const response = await this.chatService.getResponseByAuthClient(requestBody, 'text'); // ai 의 답변 받음
        const result = this.chatService.extractContentOnly(response, 'text'); // 답변중 필요한 내용만 추출
        return this.makeCustomizedJsonForm(result, expression, meaning, level); // 프론트로 반환해주기 전에 요청한 양식에 맞춰서 json 재구성
    }

    private makeCustomizedJsonForm(result: string, expression: string, meaning: string, level: number): Map<string, any> {
        const resultSplit = result.split(',, ');
        const responseBody = new Map<string, any>();
        responseBody.set('id', `level${level}`);
        responseBody.set('no', level);
        responseBody.set('sentence', `(레벨${level})${expression}`);
        responseBody.set('sentence_translation', meaning);

        // 예시 문장 3개
        const similars = new Array(3);
        const similars_trans = new Array(3);
        for (let i = 0; i < 3; i++) {
            const temp = resultSplit[i].split('(');
            similars[i] = temp[0];
            similars_trans[i] = temp[1].slice(0, -1); // 제일 뒤에 '(' 뺌
        }
        responseBody.set('similar', similars);
        responseBody.set('similar_translation', similars_trans);

        // 대화 2개
        const dialogue = new Array(2);
        const dialogue_translation = new Array(2);

        let temp = resultSplit[3].split('(');
        dialogue[0] = temp[0];
        dialogue_translation[0] = `A: ${temp[1].slice(0, -1)}`;
        temp = resultSplit[4].split('(');
        dialogue[1] = temp[0];
        dialogue_translation[1] = `B: ${temp[1].slice(0, -1)}`;
        responseBody.set('dialogue', dialogue);
        responseBody.set('dialogue_translation', dialogue_translation);
        responseBody.set('used', false);

        return responseBody;
    }

    private pickTopic(): string {
        const randomNumber = randomInt(0, 10); // 0부터 9까지의 랜덤한 숫자 생성
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
}
