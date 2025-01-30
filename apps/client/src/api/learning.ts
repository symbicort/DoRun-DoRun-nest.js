import { api } from "./axios";
import { Sentence } from "./type/learning";

// 단어
export const fetchLearningSentences = async (level: string) => {
  const response = await api.get('/learn', {
    params: { course: level }
  });
  return response.data;
};

// 예제 예문
export const fetchAiExample = async (sentence: Sentence, level: number) => {
  const response = await api.get('/practice', {
    params: {
      expression: sentence.mission,
      meaning: sentence.meaning,
      level: level
    }
  });
  console.log('예문 받아오기' ,response.data)
  return response.data;
};

// 학습완료
export const markSentenceLearned = async (missionId: string) => {
  const response = await api.post('/learned', { mission_id: missionId })
  return response.data;
};
