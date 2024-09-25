import { configureStore } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import signUpReducer from './features/signUpSlice';
import loginReducer from './features/loginSlice';
import userCheckReducer from './features/userIdCheck';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['login'], 
// };

// const persistedLoginReducer = persistReducer(persistConfig, loginReducer); 

const store = configureStore({
  reducer: {
    signup: signUpReducer,
    login: loginReducer,
    usercheck: userCheckReducer,
  },
});

export default store;
// export const persistor = persistStore(store);
// export type AppDispatch = typeof store.dispatch;
