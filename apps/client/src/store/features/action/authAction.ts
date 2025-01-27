import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { loginAPI, logoutAPI, registerUserAPI, userIdCheckAPI } from "../../../api/auth";
import { RegisterUserDTO, LoginUserDTO } from "../../../api/type/authDTO";

// 회원가입
export const registerUser = createAsyncThunk(
  "user/register",
  async (userdata: RegisterUserDTO, { rejectWithValue }) => {
    try {
      return await registerUserAPI(userdata);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("회원가입 에러:", error);
        return rejectWithValue(error.response?.data || "회원가입 실패");
      }
      return rejectWithValue("알 수 없는 에러가 발생했습니다.");
    }
  }
);

// 로그인
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (userdata: LoginUserDTO, { rejectWithValue }) => {
    try {
      const user = await loginAPI(userdata);
      console.log('redux thunk', user);
      return user;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('알 수 없는 에러가 발생했습니다.');
    }
  }
);

// 로그아웃
export const logoutUser = createAsyncThunk(
  'login/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutAPI();
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
      }
      return rejectWithValue('알 수 없는 에러가 발생했습니다.');
    }
  }
);


// 아이디 체크
export const userIdCheck = createAsyncThunk(
  'userCheck/userIdCheck',
  async (userdata: string) => {
    const response = await userIdCheckAPI(userdata);
    return response;
  }
);