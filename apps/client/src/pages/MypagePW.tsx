// Mypage.tsx
import '../assets/css/auth.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchUserInfo, changeUserPassword } from '../store/features/action/userAction';
import useUserData from '../components/UserData';
import { LogoLink } from '../components/common/LogoLink';
import { PasswordChangeForm } from '../components/auth/PasswordChangeForm';

type FormData = {
  userId: string;
  email: string;
  password: string;
};

export default function MypagePW() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userCheck } = useUserData();
  const { userId, email, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handlePasswordChange = async (userdata: FormData) => {
    try {
      await dispatch(changeUserPassword(userdata)).unwrap();
      navigate('/');
      alert('비밀번호가 변경되었습니다');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('비밀번호 변경 중 오류가 발생했습니다.');
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
              <p className='text-sm text-gray-400'>DoRun-DoRun 비밀번호를 수정 하실 수 있습니다.</p>
              <PasswordChangeForm 
                userId={userId} 
                email={email} 
                loading={loading} 
                onSubmit={handlePasswordChange} 
              />
              {error && <p className='text-red-500'>{error}</p>}
            </div> 
          )}
        </div>
      </div>
    </div>
  );
}
