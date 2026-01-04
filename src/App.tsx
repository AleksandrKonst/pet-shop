import { StrictMode, Suspense, ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector } from '@/store/hooks';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { CartPage } from '@/pages/CartPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { AdminPage } from '@/pages/AdminPage';
import './App.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d96206',
    },
    secondary: {
      main: '#000000',
    },
  },
});

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return !isAuthenticated ? children : <Navigate to="/" />;
};

export const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<div>Загрузка...</div>}>
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
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
};
