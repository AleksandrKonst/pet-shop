import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { productsApi, categoriesApi, cartApi, Product, Category } from '@/services/api';

type SortType = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export const ProductsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('name-asc');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Загрузка товаров
      const productsResponse = await productsApi.getAll(
        categoryId ? parseInt(categoryId) : undefined
      );
      setProducts(productsResponse.data);

      // Загрузка информации о категории
      if (categoryId) {
        const categoryResponse = await categoriesApi.getById(parseInt(categoryId));
        setCategory(categoryResponse.data);
      }
    } catch (err: any) {
      setError('Ошибка загрузки товаров');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Сортировка товаров
  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(productId);
      await cartApi.addToCart({ productId, quantity: 1 });
      setSuccess('Товар добавлен в корзину!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка добавления в корзину');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <Box>
      {/* Верхняя панель */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button onClick={() => navigate('/')} sx={{ mr: 2 }}>
            ← Назад
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {category ? category.name : 'Все товары'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <>
                {user.role === 'Manager' ? (
                  <Button variant="contained" size="small" onClick={() => navigate('/admin')}>
                    👨‍💼 Админ-панель
                  </Button>
                ) : (
                  <>
                    <Button variant="outlined" size="small" onClick={() => navigate('/cart')}>
                      🛒 Корзина
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => navigate('/orders')}>
                      📦 Заказы
                    </Button>
                  </>
                )}
                <Typography variant="body2">
                  {user.username}
                </Typography>
                <Button variant="outlined" size="small" onClick={logout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" size="small" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button variant="contained" size="small" onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Сортировка */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Найдено товаров: {sortedProducts.length}
          </Typography>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={sortBy}
              label="Сортировка"
              onChange={(e) => setSortBy(e.target.value as SortType)}
            >
              <MenuItem value="name-asc">По названию (А-Я)</MenuItem>
              <MenuItem value="name-desc">По названию (Я-А)</MenuItem>
              <MenuItem value="price-asc">По цене (дешевле)</MenuItem>
              <MenuItem value="price-desc">По цене (дороже)</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
        ) : sortedProducts.length === 0 ? (
          <Alert severity="info">Товары не найдены</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {sortedProducts.map((product) => (
              <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Категория: {product.categoryName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    В наличии: {product.stock} шт.
                  </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" color="primary">
                        {product.price} ₽
                      </Typography>
                      {user?.role === 'Manager' ? (
                        <Typography variant="caption" color="text.secondary">
                          Менеджеры не могут покупать
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={product.stock === 0 || addingToCart === product.id}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          {addingToCart === product.id
                            ? '...'
                            : product.stock === 0
                            ? 'Нет в наличии'
                            : user
                            ? 'В корзину'
                            : 'Войти'}
                        </Button>
                      )}
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

