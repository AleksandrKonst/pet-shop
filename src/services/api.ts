import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление токена к каждому запросу
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Типы данных
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}

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

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

// API методы
export const authApi = {
  register: (data: RegisterDto) => api.post<AuthResponse>('/auth/register', data),
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),
};

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

export const productsApi = {
  getAll: (categoryId?: number) => {
    const params = categoryId ? { categoryId } : {};
    return api.get<Product[]>('/products', { params });
  },
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: CreateProductDto) => api.post<Product>('/products', data),
  update: (id: number, data: UpdateProductDto) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
  create: (data: CreateCategoryDto) => api.post<Category>('/categories', data),
  update: (id: number, data: UpdateCategoryDto) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

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

export const cartApi = {
  getCart: () => api.get<CartSummary>('/cart'),
  addToCart: (data: AddToCartDto) => api.post<CartItem>('/cart', data),
  updateCartItem: (id: number, quantity: number) => api.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id: number) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

export const ordersApi = {
  getOrders: () => api.get<Order[]>('/orders'),
  getAllOrders: () => api.get<Order[]>('/orders/all'), // Для Manager - все заказы
  getOrderById: (id: number) => api.get<Order>(`/orders/${id}`),
  createOrder: () => api.post<Order>('/orders'),
};

export default api;

