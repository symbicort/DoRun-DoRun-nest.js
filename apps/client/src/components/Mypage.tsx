import { useForm } from 'react-hook-form';
import '../assets/css/auth.css';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserData from './UserData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchUserInfo, changeUserEmail, withdrawUser } from '../store/features/action/userAction';

type FormData = {
  userId: string;
  email: string;
  password: string;
};

export default function Mypage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userCheck } = useUserData();
  const { userId, email, password } = useAppSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      setValue('userId', userId);
      setValue('email', email);
      setValue('password', password);
    }
  }, [userId, email, password, setValue]);

  const handleEmailChange = async (userdata: FormData) => {
    try {
      await dispatch(changeUserEmail(userdata)).unwrap();
      navigate('/');
      alert('이메일이 변경되었습니다');
    } catch (error) {
      alert(error.message || '이메일 변경 중 오류가 발생했습니다.');
    }
  };

  const handleWithdraw = async () => {
    const confirmWithdraw = window.confirm('정말로 회원탈퇴를 하시겠습니까?');
    if (confirmWithdraw) {
      try {
        await dispatch(withdrawUser(userId)).unwrap();
        navigate('/');
      } catch (error) {
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
            <Link to='/'>
              <h1 className='logo'>DoRun-DoRun</h1>
            </Link>
          </div>
          {userCheck && (
            <div className='form-box'>
              <h2 className='font-bold mb-2'>프로필 수정</h2>
              <p className='text-sm text-gray-400'>DoRun-DoRun e-mail과 비밀번호를 수정 하실 수 있습니다.</p>
              <form className='auth-form' onSubmit={handleSubmit(handleEmailChange)}>
                <label className='auth-label' htmlFor='userId'>
                  아이디
                </label>
                <input
                  className='auth-input'
                  value={userId}
                  type='text'
                  id='userId'
                  disabled
                />

                <label className='auth-label' htmlFor='email'>
                  이메일
                </label>
                <input
                  className='auth-input'
                  type='email'
                  id='email'
                  value={email}
                  placeholder='이메일을 변경해주세요'
                  {...register('email', {
                    required: '이메일을 입력해주세요',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: '유효한 이메일 주소를 입력하세요'
                    }
                  })}
                />
                {errors.email && (
                  <span className='authSpan text-blue-500 text-xs' role='alert'>
                    {errors.email.message}
                  </span>
                )}

                <label className='auth-label' htmlFor='password'>
                  비밀번호
                </label>
                <input
                  className='auth-input'
                  type='password'
                  id='password'
                  placeholder="'영문, 숫자, 대문자, 특수문자 포함 8자리 이상'"
                  {...register('password', {
                    required: '비밀번호를 입력하세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8자 이상이어야 합니다'
                    },
                    validate: (value) => {
                      const pwNumber = /\d/.test(value);
                      const pwUpperCase = /[A-Z]/.test(value);
                      const pwLowerCase = /[a-z]/.test(value);
                      const pwSpecialChar = /[!@#$%^&*]/.test(value);
                      return (
                        pwNumber &&
                        pwUpperCase &&
                        pwLowerCase &&
                        pwSpecialChar ||
                        '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다'
                      );
                    }
                  })}
                />
                {errors.password && (
                  <span className='authSpan text-blue-500 text-xs' role='alert'>
                    {errors.password.message}
                  </span>
                )}
                <Link to='/mypagepw'>
                  <p className='auth-span text-blue-500 font-black text-left mt-4 cursor-pointer' role='alert'>
                    비밀번호 변경
                  </p>
                </Link>
                <button className='auth-btn mt-11' type='submit'>
                  이메일 변경하기
                </button>
              </form>
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
