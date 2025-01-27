import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { getReviewsAPI } from '../../../api/review';

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const reviews = await getReviewsAPI();
      return reviews;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
      }
      return rejectWithValue('알 수 없는 에러가 발생했습니다.');
    }
  }
);
