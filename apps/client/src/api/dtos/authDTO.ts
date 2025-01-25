// 공용
export interface User {
  userId: string;
  email: string;
  password?: string;
}

// 로그인
export interface LoginUserDTO {
  userId: string;
  password: string;
}

export interface LoginState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

// 회원가입
export interface RegisterUserDTO {
  userId: string;
  email: string;
  password: string;
}

export interface RegisterState {
  user: User | null;
  loading: boolean;
  error: string | null;
}


// 아이디 에크
export interface UserCheckIdDTO {
  userId: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


