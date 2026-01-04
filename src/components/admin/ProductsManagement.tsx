import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/store/api/productsApi';
import { useGetCategoriesQuery } from '@/store/api/categoriesApi';
import type { Product } from '@/store/api/productsApi';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

export const ProductsManagement = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useGetProductsQuery(undefined);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    mode: 'onBlur',
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId,
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        categoryId: categories[0]?.id || 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data }).unwrap();
        setSuccess('Товар обновлен');
      } else {
        await createProduct(data).unwrap();
        setSuccess('Товар создан');
      }
      handleCloseDialog();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Ошибка сохранения');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить товар?')) return;

    try {
      await deleteProduct(id).unwrap();
      setSuccess('Товар удален');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Ошибка удаления');
      setTimeout(() => setError(''), 3000);
    }
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Управление товарами ({products.length})</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          + Создать товар
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {products.map(product => (
          <Card key={product.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="body2">
                    Цена: <strong>{product.price} ₽</strong> | Остаток:{' '}
                    <strong>{product.stock} шт.</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Категория: {product.categoryName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={() => handleOpenDialog(product)}>
                    Изменить
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(product.id)}
                  >
                    Удалить
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Создать товар'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              {...register('name', {
                required: 'Название обязательно',
                minLength: {
                  value: 2,
                  message: 'Минимум 2 символа',
                },
                maxLength: {
                  value: 200,
                  message: 'Максимум 200 символов',
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Описание"
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Максимум 1000 символов',
                },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Цена (₽)"
              type="number"
              {...register('price', {
                required: 'Цена обязательна',
                min: {
                  value: 0.01,
                  message: 'Цена должна быть больше 0',
                },
                max: {
                  value: 1000000,
                  message: 'Цена слишком большая',
                },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
              margin="normal"
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              label="Количество на складе"
              type="number"
              {...register('stock', {
                required: 'Количество обязательно',
                min: {
                  value: 0,
                  message: 'Количество не может быть отрицательным',
                },
                max: {
                  value: 100000,
                  message: 'Количество слишком большое',
                },
              })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              margin="normal"
              inputProps={{ step: '1' }}
            />
            <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
              <InputLabel>Категория</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: 'Категория обязательна', min: 1 }}
                render={({ field }) => (
                  <Select {...field} label="Категория">
                    {categories.map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
            </FormControl>
            <TextField
              fullWidth
              label="URL изображения (необязательно)"
              {...register('imageUrl', {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: 'Неверный формат URL',
                },
              })}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button type="submit" variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
