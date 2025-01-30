export interface Sentence {
    meaning: string;
    mission: string;
    missionId: string;
    learned: boolean;
  }
  
export interface PreviewData {
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
  
export interface LearningState {
    sentences: Sentence[];
    selectedSentenceData: PreviewData | null;
    isLoading: boolean;
    error: string | null;
  }
  