import axios from 'axios';
import { LoginUserDTO, RegisterUserDTO } from './dtos/authDTO.ts'

const API_URL = "https://43.203.227.36.sslip.io/server"

// 토큰 관리
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 로그인
export const loginAPI = async (userdata: LoginUserDTO) => {
  try {
    const response = await api.post('/user/login', userdata);
    console.log('login Api', response)
    if (response.data.result === false) {
      throw new Error(response.data.msg);
    }
    localStorage.setItem('token', response.data.token);
    return {
      userId: response.data.user,
      email: response.data.email
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 로그아웃
export const logoutAPI = async () => {
  try {
    await api.get('/user/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// 회원가입
export const registerUserAPI = async (userData: RegisterUserDTO) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
    throw error;
  }
};

// 유저 체크
export const userIdCheckAPI = async (InputId: string) => {
  const response = await api.get('/user/checkDupId', { params: { InputId } });
  return response.data;
}
