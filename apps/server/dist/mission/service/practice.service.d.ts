import { ChatService } from 'src/chat/service/chat.service';
import { PracticeContext } from 'src/constants/practice-context';
import { getPracticeResDto } from 'src/mission/dto/mission.dto';
export declare class PracticeService {
    private readonly chatService;
    private readonly practiceContext;
    constructor(chatService: ChatService, practiceContext: PracticeContext);
    getPractice(expression: string, meaning: string, level: number): Promise<getPracticeResDto>;
    private makeCustomizedJsonForm;
    private pickTopic;
}
