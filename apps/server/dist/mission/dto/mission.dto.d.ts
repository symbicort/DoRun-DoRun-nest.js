export declare class MissionDto {
    missionId: number;
    mission: string;
    meaning: string;
    complete: boolean;
}
export declare class getPracticeDto {
    expression: string;
    meaning: string;
    level: number;
}
export declare class getPracticeResDto {
    id: string;
    no: number;
    sentence: string;
    sentence_translation: string;
    similar: string[];
    similar_translation: string[];
    dialogue: string[];
    dialogue_translation: string[];
    used: boolean;
}
export declare class checkMissionDto {
    missions: string[];
    chat: string;
}
