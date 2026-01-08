import { baseApi } from '@/shared/api/base-api';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: 'User' | 'Manager';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: 'User' | 'Manager';
  token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: credentials => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<AuthResponse, LoginDto>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
