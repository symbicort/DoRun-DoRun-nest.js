import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { RHFInput } from './common/RFHInput';

type FormData = {
  userId: string;
  email: string;
  password: string;
};

interface EmailChangeFormProps {
  userId: string;
  email: string;
  onSubmit: (data: FormData) => void;
}

export function EmailChangeForm({ userId, email, onSubmit }: EmailChangeFormProps) {
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
        placeholder="이메일을 변경해주세요"
        register={register}
        errors={errors}
        validation={{
          required: '이메일을 입력해주세요',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: '유효한 이메일 주소를 입력하세요'
          }
        }}
      />

      <RHFInput<FormData>
        name="password"
        label="비밀번호"
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

      <Link to='/mypagepw'>
        <p className='auth-span text-blue-500 font-black text-left mt-4 cursor-pointer' role='alert'>
          비밀번호 변경
        </p>
      </Link>
      <button className='auth-btn mt-11' type='submit'>
        이메일 변경하기
      </button>
    </form>
  );
}
