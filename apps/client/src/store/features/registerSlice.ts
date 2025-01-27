import { createSlice } from '@reduxjs/toolkit';
import { RegisterState } from '../../api/type/authDTO';
import { registerUser } from './action/authAction';

const initialState: RegisterState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {}, // 기존의 동기 액션 제거
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action ) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
  },
});

export default authSlice.reducer;
