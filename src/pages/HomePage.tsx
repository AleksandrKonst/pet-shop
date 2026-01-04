import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useGetCategoriesQuery } from '@/store/api/categoriesApi';
import { ImageCarousel } from '@/components/carousel/ImageCarousel';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" color="primary">
            Интернет-магазин зоотоваров
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <>
                {user.role === 'Manager' ? (
                  <Button variant="contained" onClick={() => navigate('/admin')}>
                    👨‍💼 Админ-панель
                  </Button>
                ) : (
                  <>
                    <Button variant="outlined" onClick={() => navigate('/cart')}>
                      🛒 Корзина
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/orders')}>
                      📦 Заказы
                    </Button>
                  </>
                )}
                <Typography variant="body1">{user.username}</Typography>
                <Button variant="outlined" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button variant="contained" onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Typography variant="h6" component="h2" align="center" color="text.secondary" gutterBottom>
          Добро пожаловать в наш магазин!
        </Typography>

        {/* Карусель изображений */}
        <ImageCarousel />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Ошибка загрузки категорий
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3} sx={{ mt: 4 }} direction={{ xs: 'column', md: 'row' }}>
            {categories.map(category => (
              <Box key={category.id} sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 2 }}
                    >
                      Товаров: {category.productCount}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCategoryClick(category.id)}
                      fullWidth
                    >
                      Смотреть товары
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};
