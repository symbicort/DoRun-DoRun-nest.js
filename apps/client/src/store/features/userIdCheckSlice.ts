import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserCheckIdDTO } from "../../api/type/authDTO";
import { userIdCheck } from "./action/authAction";

const initialState: UserCheckIdDTO = {
  userId: false,
  status: 'idle',
  error: null
};

const userCheckSlice = createSlice({
  name: "userCheck",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userIdCheck.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(userIdCheck.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.status = 'succeeded';
        state.userId = action.payload;
      })
      .addCase(userIdCheck.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default userCheckSlice.reducer;
