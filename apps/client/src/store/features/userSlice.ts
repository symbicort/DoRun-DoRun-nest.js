import { createSlice } from '@reduxjs/toolkit';
import { changeUserEmail, changeUserPassword, fetchUserInfo, withdrawUser } from './action/userAction';
import { UserState } from '../../api/type/userDTO'


const initialState: UserState = {
  userId: '',
  email: '',
  password: '',
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.password = action.payload.password;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeUserEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
      })
      .addCase(changeUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(withdrawUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(withdrawUser.fulfilled, (state) => {
        state.loading = false;
        return initialState;
      })
      .addCase(withdrawUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.password = action.payload.password; 
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
});

export default userSlice.reducer;
