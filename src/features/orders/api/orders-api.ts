import { baseApi } from '@/shared/api/base-api';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Orders' as const, id })), 'Orders']
          : ['Orders'],
    }),
    getAllOrders: builder.query<Order[], void>({
      query: () => '/orders/all',
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'Orders' as const, id })), 'Orders']
          : ['Orders'],
    }),
    getOrderById: builder.query<Order, number>({
      query: id => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders' as const, id }],
    }),
    createOrder: builder.mutation<Order, void>({
      query: () => ({
        url: '/orders',
        method: 'POST',
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
} = ordersApi;
