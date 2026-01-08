import { baseApi } from '@/shared/api/base-api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  categoryName: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<Product[], number | undefined>({
      query: categoryId => ({
        url: '/products',
        params: categoryId ? { categoryId } : {},
      }),
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Products' as const, id })), 'Products']
          : ['Products'],
    }),
    getProductById: builder.query<Product, number>({
      query: id => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products' as const, id }],
    }),
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: data => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { id: number; data: UpdateProductDto }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Products' as const, id }],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
