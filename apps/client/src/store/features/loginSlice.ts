import { createSlice } from '@reduxjs/toolkit';
import { LoginState} from '../../api/dtos/authDTO';
import { loginUser, logoutUser } from './action/authAction';

const initialState: LoginState = {
  loading: false,
  user: null,
  error: null,
  isLoggedIn: localStorage.getItem('token') !== null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    restoreUser:(state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log('redux user', state.user)
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('token');
      });
  },
});

export const { restoreUser } = loginSlice.actions
export default loginSlice.reducer;
