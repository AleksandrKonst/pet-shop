import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { cartApi, ordersApi, CartSummary } from '@/services/api';

export const CartPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartApi.getCart();
      setCart(response.data);
    } catch (err: any) {
      setError('Ошибка загрузки корзины');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await cartApi.updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (err: any) {
      setError('Ошибка обновления количества');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartApi.removeFromCart(itemId);
      await loadCart();
      setSuccess('Товар удален из корзины');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Ошибка удаления товара');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Очистить корзину?')) return;

    try {
      await cartApi.clearCart();
      await loadCart();
      setSuccess('Корзина очищена');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Ошибка очистки корзины');
    }
  };

  const handleCreateOrder = async () => {
    if (!cart || cart.items.length === 0) return;

    try {
      setIsLoading(true);
      await ordersApi.createOrder();
      setSuccess('Заказ успешно оформлен!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка оформления заказа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button onClick={() => navigate('/')} sx={{ mr: 2 }}>
            ← Главная
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Корзина
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="outlined" size="small" onClick={() => navigate('/orders')}>
              📦 Мои заказы
            </Button>
            <Typography variant="body2">{user?.username}</Typography>
            <Button variant="outlined" size="small" onClick={logout}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !cart || cart.items.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                Корзина пуста
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                Перейти к покупкам
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              {cart.items.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{item.productName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Цена: {item.productPrice} ₽
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </IconButton>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val > 0) handleUpdateQuantity(item.id, val);
                            }}
                            sx={{ width: 60 }}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ minWidth: 100, textAlign: 'right' }}>
                          {item.productPrice * item.quantity} ₽
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Удалить
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Товаров:</Typography>
                  <Typography variant="h6">{cart.totalItems} шт.</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5">Итого:</Typography>
                  <Typography variant="h5" color="primary">
                    {cart.totalAmount} ₽
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={handleClearCart} sx={{ flex: 1 }}>
                    Очистить корзину
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCreateOrder}
                    sx={{ flex: 2 }}
                  >
                    Оформить заказ
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
};

