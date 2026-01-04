import { baseApi } from './baseApi';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCart: builder.query<CartSummary, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<CartItem, AddToCartDto>({
      query: data => ({
        url: '/cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<void, { id: number; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/cart/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<void, number>({
      query: id => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
