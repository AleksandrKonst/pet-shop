import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useGetAllOrdersQuery } from '@/features/orders';

export const AllOrdersView = () => {
  const { data: orders = [], isLoading, error } = useGetAllOrdersQuery();

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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Ошибка загрузки заказов
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Заказов пока нет
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Все заказы ({orders.length})
      </Typography>

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
  );
};
