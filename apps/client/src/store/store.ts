import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/registerSlice';
import loginReducer from './features/loginSlice';
import userCheckReducer from './features/userIdCheckSlice';
import userReducer from './features/userSlice'
import reveiwReducer from './features/reviewSlice'

const store = configureStore({
  reducer: {
    register: authReducer,
    login: loginReducer,
    usercheck: userCheckReducer,
    users : userReducer,
    review : reveiwReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;