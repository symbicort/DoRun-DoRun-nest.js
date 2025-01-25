import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { changeUserEmailAPI, changeUserPWAPI, fetchUserInfoAPI, withdrawUserAPI } from "../../../api/user";

export const fetchUserInfo = createAsyncThunk(
  "user/fetchInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserInfoAPI();
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "사용자 정보 조회 실패");
      }
      return rejectWithValue("알 수 없는 에러가 발생했습니다.");
    }
  }
);

export const changeUserEmail = createAsyncThunk(
  "user/changeEmail",
  async (userData: { userId: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return await changeUserEmailAPI(userData);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "이메일 변경 실패");
      }
      return rejectWithValue("알 수 없는 에러가 발생했습니다.");
    }
  }
);

export const withdrawUser = createAsyncThunk(
  "user/withdraw",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await withdrawUserAPI(userId);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "회원 탈퇴 실패");
      }
      return rejectWithValue("알 수 없는 에러가 발생했습니다.");
    }
  }
);
export const changeUserPassword = createAsyncThunk(
    "user/changePassword",
    async (userData: { userId: string; email: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await changeUserPWAPI(userData);
        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || "비밀번호 변경 실패");
        }
        return rejectWithValue("알 수 없는 에러가 발생했습니다.");
      }
    }
  );