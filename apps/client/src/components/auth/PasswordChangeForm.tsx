import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { RHFInput } from '../common/RFHInput';

type FormData = {
  userId: string;
  email: string;
  password: string;
};

interface PasswordChangeFormProps {
  userId: string;
  email: string;
  loading: boolean;
  onSubmit: (data: FormData) => void;
}

export function PasswordChangeForm({ userId, email, loading, onSubmit }: PasswordChangeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userId,
      email,
    },
  });

  return (
    <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
      <RHFInput<FormData>
        name="userId"
        label="아이디"
        type="text"
        placeholder=""
        register={register}
        errors={errors}
        validation={{ disabled: true }}
      />

      <RHFInput<FormData>
        name="email"
        label="이메일"
        type="email"
        placeholder=""
        register={register}
        errors={errors}
        validation={{ disabled: true }}
      />

      <RHFInput<FormData>
        name="password"
        label="새 비밀번호"
        type="password"
        placeholder="'영문, 숫자, 대문자, 특수문자 포함 8자리 이상'"
        register={register}
        errors={errors}
        validation={{
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
        }}
      />

      <button className='auth-input mt-11' type='submit' disabled={loading}>
        {loading ? '변경 중...' : '비밀번호 변경하기'}
      </button>

      <Link to='/mypage'>
        <p className='auth-span text-blue-500 font-black mb-2 text-right cursor-pointer' role='alert'>
          이메일 변경하기
        </p>
      </Link>
    </form>
  );
}
