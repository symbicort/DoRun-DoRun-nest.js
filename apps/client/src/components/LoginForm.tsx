import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';
import { RHFInput } from './RFHInput';
import { loginUser } from '../store/features/action/authAction';
import { useAppDispatch } from '../hooks/useRedux';

type FormData = {
  userId: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (userData) => {
    try {
      const result = await dispatch(loginUser(userData)).unwrap();
      console.log('Login successful:', result);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  

  const onError: SubmitErrorHandler<FormData> = (errors) => {
    console.log('onError', errors);
  };
  return (
            <form
              className='auth-form'
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <RHFInput
                 name="userId"
                 label="아이디"
                 type="text"
                 placeholder="아이디를 입력해주세요"
                 register={register}
                 errors={errors}
                 validation={{ required: '아이디를 입력해주세요' }}
              />
               <RHFInput
                  name="password"
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  register={register}
                  errors={errors}
                  validation={{
                    required: '비밀번호를 입력하세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8자 이상이어야 합니다',
                    },
                    validate: (value) => {
                      const hasNumber = /\d/.test(value);
                      const hasUpperCase = /[A-Z]/.test(value);
                      const hasLowerCase = /[a-z]/.test(value);
                      const hasSpecialChar = /[!@#$%^&*]/.test(value);
                      return (
                        (hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar) ||
                        '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다'
                      );
                    },
                  }}
                />
              <button className='auth-btn' type='submit'>
                로그인
              </button>
            </form>
  );
}
