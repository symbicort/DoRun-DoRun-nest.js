import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCourseLevelAPI } from "../../../api/course";
import { AxiosError } from "axios";

export const setCourseLevel = createAsyncThunk(
    'course/setCourseLevel',
    async (level: string, { rejectWithValue }) => {
      try {
        const response = await setCourseLevelAPI(level);
        console.log('course?', response)
        return level; 
      } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data?.message || '사용자 학습 fail');
          }
          return rejectWithValue('알 수 없는 에러가 발생했습니다.');
      }
    }
  );