import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { ordersApi, Order } from '@/services/api';

export const AllOrdersView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Ошибка загрузки заказов');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

  const getTotalRevenue = () => {
    return orders
      .filter((o) => o.status === 'Pending' || o.status === 'Completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Все заказы ({orders.length})</Typography>
        <Card sx={{ px: 3, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Общая выручка
          </Typography>
          <Typography variant="h5" color="primary">
            {getTotalRevenue().toLocaleString()} ₽
          </Typography>
        </Card>
      </Box>

      {orders.length === 0 ? (
        <Alert severity="info">Заказов пока нет</Alert>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
    </Box>
  );
};

