import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = () => {
  const [user, setUser] = useState('');
  const [userCheck, setUserCheck] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 배포 시 URL 재설정
        // const API_URL = 'https://43.203.227.36.sslip.io/server';

        const API_URL: string = 'http://localhost:3050'
        const response = await axios.get(`${API_URL}/user/authuser`, { withCredentials: true });
        setUserCheck(response.data.result);
        setUser(response.data.userId || '');
        setProfileImage(response.data.profileImageUrl || ''); 
      } catch (error) {
        console.error('에러가 발생했습니다:', error);
      }
    };
    fetchData();
  }, []); 

  return { user, setUser, userCheck, setUserCheck, profileImage, setProfileImage };
};

export default useUserData;
