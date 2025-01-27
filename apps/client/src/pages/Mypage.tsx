// Mypage.tsx
import '../assets/css/auth.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchUserInfo, changeUserEmail, withdrawUser } from '../store/features/action/userAction';
import useUserData from '../components/UserData';
import { LogoLink } from '../components/common/LogoLink';
import { EmailChangeForm } from '../components/auth/EmailChangeForm';

type FormData = {
  userId: string;
  email: string;
  password: string;
};

export default function Mypage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userCheck } = useUserData();
  const { userId, email } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleEmailChange = async (userdata: FormData) => {
    try {
      await dispatch(changeUserEmail(userdata)).unwrap();
      navigate('/');
      alert('이메일이 변경되었습니다');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('이메일 변경 중 오류가 발생했습니다.');
      }
    }
  };

  const handleWithdraw = async () => {
    const confirmWithdraw = window.confirm('정말로 회원탈퇴를 하시겠습니까?');
    if (confirmWithdraw) {
      try {
        await dispatch(withdrawUser(userId)).unwrap();
        navigate('/');
      } catch (error: unknown) {
        console.error('에러:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className='form-container'>
      <div className='form-area signup'>
        <div className='form-elements'>
          <div className='form-title signup py-5'>
            <LogoLink path={'/'}>DorunDorun</LogoLink>
          </div>
          {userCheck && (
            <div className='form-box'>
              <h2 className='font-bold mb-2'>프로필 수정</h2>
              <p className='text-sm text-gray-400'>DoRun-DoRun e-mail과 비밀번호를 수정 하실 수 있습니다.</p>
              <EmailChangeForm userId={userId} email={email} onSubmit={handleEmailChange} />
              <p onClick={handleWithdraw} className='auth-span font-black opacity-60 mb-4 text-right cursor-pointer' role='alert'>
                회원탈퇴
              </p>
            </div> 
          )}
        </div>
      </div>
    </div>
  );
}
