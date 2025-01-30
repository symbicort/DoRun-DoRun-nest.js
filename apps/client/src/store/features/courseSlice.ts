import { createSlice } from '@reduxjs/toolkit';
import { setCourseLevel } from './action/courseAction';

interface CourseState {
  currentLevel: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  currentLevel: null,
  loading: false,
  error: null,
}

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setCourseLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCourseLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLevel = action.payload;
      })
      .addCase(setCourseLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;