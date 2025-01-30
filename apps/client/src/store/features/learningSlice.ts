import { createSlice } from '@reduxjs/toolkit';
import { LearningState } from '../../api/type/learning';
import { getAiExample, getSentences, learnSentence } from './action/learningAction';

const initialState: LearningState = {
  sentences: [],
  selectedSentenceData: null,
  isLoading: false,
  error: null
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSentences.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSentences.fulfilled, (state, action) => {
        state.sentences = action.payload;
        state.isLoading = false;
      })
      .addCase(getAiExample.fulfilled, (state, action) => {
        state.selectedSentenceData = action.payload;
        state.isLoading = false;
      })
      .addCase(learnSentence.fulfilled, (state, action) => {
        const index = state.sentences.findIndex(s => s.missionId === action.payload);
        if (index !== -1) {
          state.sentences[index].learned = true;
        }
      });
  }
});

export default learningSlice.reducer;
