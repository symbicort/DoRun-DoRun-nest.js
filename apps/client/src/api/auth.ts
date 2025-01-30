import { api } from './axios.ts';
import { LoginUserDTO, RegisterUserDTO } from './type/authDTO.ts'

// 로그인
export const loginAPI = async (userdata: LoginUserDTO) => {
  try {
    const response = await api.post('/user/login', userdata);
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
    console.error('register error:', error);
    throw error;
  }
};

// 유저 체크
export const userIdCheckAPI = async (InputId: string) => {
  const response = await api.get('/user/checkDupId', { params: { InputId } });
  return response.data;
}
