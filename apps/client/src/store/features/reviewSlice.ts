import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReviewData, DummyData } from '../../components/Review/type'; 
import { fetchReviews } from './action/reveiwAction';

interface ReviewState {
  reviewDatas: ReviewData[];
  dummyDatas: DummyData[];
  sortedBy: string;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviewDatas: [],
  dummyDatas: [],
  sortedBy: '최신순',
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setSortedBy: (state, action: PayloadAction<string>) => {
      state.sortedBy = action.payload;
    },
    setDummyDatas: (state, action: PayloadAction<DummyData[]>) => {
      state.dummyDatas = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDatas = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSortedBy, setDummyDatas } = reviewSlice.actions;
export default reviewSlice.reducer;
