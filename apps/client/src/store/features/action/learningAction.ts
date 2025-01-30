import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAiExample, fetchLearningSentences, markSentenceLearned } from "../../../api/learning";
import { Sentence } from "../../../api/type/learning";

export const getSentences = createAsyncThunk(
    'learning/getSentences',
    async (level: string) => {
      return await fetchLearningSentences(level);
    }
  );
  
  export const getAiExample = createAsyncThunk(
    'learning/getAiExample',
    async ({ sentence, level }: { sentence: Sentence, level: number }) => {
      return await fetchAiExample(sentence, level);
    }
  );
  
  export const learnSentence = createAsyncThunk(
    'learning/learnSentence',
    async (missionId: string) => {
      await markSentenceLearned(missionId);
      return missionId;
    }
  );