import { useForm, SubmitHandler } from 'react-hook-form';
// import { userIdCheckAPI } from '../api/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';
import { RHFInput } from './common/RFHInput';
import { registerUser, userIdCheck } from '../store/features/action/authAction';
import { useAppDispatch } from '../hooks/useRedux';

type FormData = {
  username: string;
  userId: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userIdRedundancy, setUserIdRedundancy] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (userdata) => {
    const requestData = {
      userId: userdata.userId,
      email: userdata.email,
      password: userdata.password,
    };

    dispatch(registerUser(requestData));
    navigate('/');
  };

  const handleCheckUserId = async () => {
    const userId = watch('userId');
    if (!userId) return;
    try { 
      const response = await dispatch(userIdCheck(userId)).unwrap();
      setUserIdRedundancy(response)
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  return (
    <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
      <RHFInput<FormData>
        name="username"
        label="이름"
        type="text"
        placeholder="이름을 입력해주세요"
        register={register}
        errors={errors}
        validation={{
          required: '이름을 입력해주세요',
          minLength: { value: 2, message: '이름은 최소 2글자 이상 작성해주세요' },
        }}
      />

      <label className='auth-label' htmlFor='userId'>아이디</label>
      <div className='flex'>
        <RHFInput<FormData>
          name="userId"
          label=""
          type="text"
          placeholder="6글자 이상, 영문 및 숫자 조합"
          register={register}
          errors={errors}
          validation={{
            required: '아이디를 입력해주세요',
            minLength: { value: 6, message: '아이디는 6자 이상이어야 합니다' },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              message: '아이디는 영문과 숫자의 조합으로 이루어져야 합니다',
            },
          }}
          className="mr-2 w-3/4"
        />
        <button
          className={`py-0.5 rounded text-white font-medium text-sm ${!watch('userId') ? 'bg-gray-400' : 'bg-[var(--btn-bg)]'}`}
          type='button'
          onClick={handleCheckUserId}
          disabled={!watch('userId')}
        >
          아이디 중복 검사
        </button>
      </div>
      {userIdRedundancy !== null && (
        <span className={userIdRedundancy ? 'text-red-500 text-xs' : 'text-blue-500 text-xs'}>
          {userIdRedundancy ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'}
        </span>
      )}

      <RHFInput<FormData>
        name="email"
        label="이메일"
        type="email"
        placeholder="이메일 주소를 입력해주세요"
        register={register}
        errors={errors}
        validation={{
          required: '이메일을 입력해주세요',
          pattern: { value: /\S+@\S+\.\S+/, message: '유효한 이메일 주소를 입력하세요' },
        }}
      />

      <RHFInput<FormData>
        name="password"
        label="비밀번호"
        type="password"
        placeholder="영문, 숫자, 대문자, 특수문자 포함 8자리 이상"
        register={register}
        errors={errors}
        validation={{
          required: '비밀번호를 입력하세요',
          minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다' },
          validate: (value) => 
            [/\d/, /[A-Z]/, /[a-z]/, /[!@#$%^&*]/].every((pattern) => pattern.test(value)) ||
            '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다',
        }}
      />

      <RHFInput<FormData>
        name="confirmPassword"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호와 동일하게 입력해주세요"
        register={register}
        errors={errors}
        validation={{
          required: '비밀번호를 한번 더 입력해주세요',
          validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다',
        }}
        className="mb-5"
      />

      <button
        className={userIdRedundancy === true || userIdRedundancy === null ? 'auth-btn bg-neutral-400' : 'auth-btn'}
        type='submit'
        disabled={userIdRedundancy === true || userIdRedundancy === null}
      >
        가입하기
      </button>
    </form>
  );
}
