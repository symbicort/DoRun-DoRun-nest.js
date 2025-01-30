import { createSlice } from '@reduxjs/toolkit';
import { fetchConversation } from './action/conversationAction';


export interface ConversationData {
  id: string;
  roomid: string;
  userid: string;
  ai: string;
  createdAt: number[];
  userSpeaking: boolean;
  grammarValid: boolean;
  correctedContent: string;
  content: string;
}

interface ReviewContentState {
  conversationData: ConversationData[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReviewContentState = {
  conversationData: null,
  status: 'idle',
  error: null,
};



const reviewContentSlice = createSlice({
  name: 'reviewContent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversationData = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default reviewContentSlice.reducer;
