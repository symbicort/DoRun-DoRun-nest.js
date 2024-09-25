import axios from "axios";

const API_URL: string = 'https://43.203.227.36.sslip.io/server';

export const userIdCheckApi = async (InputId: string) => {
    const response = await axios.get(`${API_URL}/user/checkDupId`, { params: { InputId } });
    console.log(response)
    return response.data;
  }

export const userNicknameCheckApi = async (nickname: string) => {
    try {
        const response = await axios.get(`${API_URL}/user/checkDupNick`, { params: { nickname } });
        console.log(response);
        if (response.data) {
            console.log('닉네임 중복됨');
        } else {
            console.log('사용 가능한 닉네임');
        }
        return response.data; 
    } catch (error) {
        console.error('오류 발생:', error);
        return { error: '닉네임 중복 확인 중 오류가 발생했습니다.' };
    }
};


