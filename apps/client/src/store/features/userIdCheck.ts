import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "@reduxjs/toolkit";
import {userIdCheckApi, userNicknameCheckApi } from "../../api/userCheck"; 


interface UserCheckId{
  userId: boolean;
  nickname : boolean;
}

const initialState: UserCheckId = {
  userId: false,
  nickname: false,
};

const userCheckSlice = createSlice({
  name: "userCheck",
  initialState,
  reducers: {
    userCheckId : (state, action: PayloadAction<boolean>) => {
      state.userId = action.payload
    },
    userCheckNickname : (state, action: PayloadAction<boolean>) => {
      state.nickname = action.payload;
    },
  },
});

export const userIdCheck = (userdata: string) => async (dispatch: Dispatch) => {
  const userIdChecked = await userIdCheckApi(userdata); 
  dispatch(userCheckId(userIdChecked));
};


export const userNicknameCheck = (userdata: string) => async (dispatch: Dispatch) => {
    const userNicknameCheck = await userNicknameCheckApi(userdata); 
    dispatch(userCheckNickname(userNicknameCheck));
};

export const { userCheckId, userCheckNickname} = userCheckSlice.actions;

export default userCheckSlice.reducer;
