import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API
    [baseApi.reducerPath]: baseApi.reducer,
    // Слайсы
    auth: authReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
});

// Настройка слушателей для refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
