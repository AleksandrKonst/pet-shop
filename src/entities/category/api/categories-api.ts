import { baseApi } from '@/shared/api/base-api';

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Categories' as const, id })), 'Categories']
          : ['Categories'],
    }),
    getCategoryById: builder.query<Category, number>({
      query: id => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Categories' as const, id }],
    }),
    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: data => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<Category, { id: number; data: UpdateCategoryDto }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Categories' as const, id }],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: id => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
