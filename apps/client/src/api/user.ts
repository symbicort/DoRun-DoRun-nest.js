import { api } from './auth';

export const fetchUserInfoAPI = async () => {
  const response = await api.get('/user/info');
  return response.data;
};

export const changeUserEmailAPI = async (userData: { userId: string; email: string; password: string }) => {
  const response = await api.patch('/user/changeEmail', userData);
  return response.data;
};

export const withdrawUserAPI = async (userId: string) => {
  const response = await api.delete('/user/withdraw', { data: { userId } });
  return response.data;
};


export const changeUserPWAPI = async (userData: {userId:string; email:string; password:string}) => {
  const response = await api.patch('/user/changePW', userData)
  return response.data
}