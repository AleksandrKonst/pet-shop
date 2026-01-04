import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const API_URL = 'http://localhost:5000/api';

// Базовая настройка RTK Query с автоматической подстановкой JWT токена
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Получаем токен из Redux state
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  // Теги для автоматической инвалидации кэша
  tagTypes: ['Auth', 'Products', 'Categories', 'Cart', 'Orders'],
  endpoints: () => ({}),
});
