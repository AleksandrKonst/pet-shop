import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@mui/material';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
} from '@/entities/category';

interface CategoryFormData {
  name: string;
  description: string;
}

export const CategoriesManagement = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    mode: 'onBlur',
  });

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      reset({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      reset({ name: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    reset({ name: '', description: '' });
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data }).unwrap();
        setSuccess('Категория обновлена');
      } else {
        await createCategory(data).unwrap();
        setSuccess('Категория создана');
      }
      handleCloseDialog();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Ошибка сохранения');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить категорию?')) return;

    try {
      await deleteCategory(id).unwrap();
      setSuccess('Категория удалена');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting category:', error);
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
        <Typography variant="h6">Управление категориями</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          + Создать категорию
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {categories.map(category => (
          <Card key={category.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{category.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Товаров: {category.productCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(category)}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(category.id)}
                    disabled={category.productCount > 0}
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
        <DialogTitle>
          {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
        </DialogTitle>
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
                  value: 100,
                  message: 'Максимум 100 символов',
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
                  value: 500,
                  message: 'Максимум 500 символов',
                },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
              margin="normal"
              multiline
              rows={3}
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
