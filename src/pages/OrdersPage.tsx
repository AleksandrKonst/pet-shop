import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useGetOrdersQuery } from '@/store/api/ordersApi';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'В обработке';
      case 'Completed':
        return 'Выполнен';
      case 'Cancelled':
        return 'Отменён';
      default:
        return status;
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
            Мои заказы
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="outlined" size="small" onClick={() => navigate('/cart')}>
              🛒 Корзина
            </Button>
            <Typography variant="body2">{user?.username}</Typography>
            <Button variant="outlined" size="small" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Ошибка загрузки заказов
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                У вас пока нет заказов
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                Перейти к покупкам
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {orders.map(order => (
              <Card key={order.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Заказ №{order.id}</Typography>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Дата: {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Товары:
                  </Typography>
                  {order.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                      }}
                    >
                      <Box>
                        <Typography variant="body2">{item.productName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} шт. × {item.price} ₽
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {item.quantity * item.price} ₽
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6">Итого:</Typography>
                    <Typography variant="h6" color="primary">
                      {order.totalAmount} ₽
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};
