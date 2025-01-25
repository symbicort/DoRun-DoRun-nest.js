export interface UserState {
    userId: string;
    email: string;
    password: string;
    loading: boolean;
    error: string | null;
  }