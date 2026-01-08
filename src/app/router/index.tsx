import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { ProductsPage } from '@/pages/products';
import { CartPage } from '@/pages/cart';
import { OrdersPage } from '@/pages/orders';
import { AdminPage } from '@/pages/admin';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { ProtectedRoute, PublicRoute } from '@/shared/lib/react-router';

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
