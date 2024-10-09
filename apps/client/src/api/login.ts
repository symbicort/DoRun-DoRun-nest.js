import axios from 'axios';

// 배포 시 URL 재설정
// const API_URL: string = 'https://43.203.227.36.sslip.io/server';

const API_URL: string = 'http://localhost:3050'

interface UserData {
  userId: string;
  password: string;
}

export const loginApi = async (userdata: UserData) => {
  const response = await axios.post(`${API_URL}/user/login`, userdata, { withCredentials: true });
  console.log('로그인 정보 : ', response);
  console.log('유저 정보 : ', userdata);
  if (response.data.result === false) {
    alert(response.data.msg);
  } else {
    window.location.href = `http://localhost:3000`
    // window.location.href = `https://43.203.227.36.sslip.io/`
    alert('로그인에 성공하였습니다');
  }
  return response.data;
};

export const logoutApi = async () => {
    const response = await axios.get(`${API_URL}/user/logout` , { withCredentials: true });
    window.location.href = `http://localhost:3000`
    //window.location.href = `https://43.203.227.36.sslip.io/`
    console.log(response);
    return response.data;
};
