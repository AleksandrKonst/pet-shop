import { baseApi } from './baseApi';

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
      providesTags: ['Orders'],
    }),
    getAllOrders: builder.query<Order[], void>({
      query: () => '/orders/all',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<Order, number>({
      query: id => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
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
