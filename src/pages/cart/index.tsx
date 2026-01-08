import { useState } from 'react';
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
import { useAppSelector, useAppDispatch } from '@/shared/lib/store/hooks';
import { logout } from '@/features/auth';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from '@/features/cart';
import { useCreateOrderMutation } from '@/features/orders';

export const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const [success, setSuccess] = useState('');

  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem({ id: itemId, quantity: newQuantity }).unwrap();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId).unwrap();
      setSuccess('Товар удален из корзины');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Очистить корзину?')) return;

    try {
      await clearCart().unwrap();
      setSuccess('Корзина очищена');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCreateOrder = async () => {
    if (!cart || cart.items.length === 0) return;

    try {
      await createOrder().unwrap();
      setSuccess('Заказ успешно оформлен!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
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
            <Button variant="outlined" size="small" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
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
              {cart.items.map(item => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
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
                            onChange={e => {
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
                    disabled={isCreatingOrder}
                    sx={{ flex: 2 }}
                  >
                    {isCreatingOrder ? 'Оформление...' : 'Оформить заказ'}
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
