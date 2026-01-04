import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: {
            id: result.id,
            username: result.username,
            email: result.email,
            role: result.role,
          },
          token: result.token,
        })
      );
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;

    if (
      'data' in error &&
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data
    ) {
      return String(error.data.message);
    }

    return 'Ошибка входа. Проверьте данные.';
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Вход
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getErrorMessage()}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Неверный формат email',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Пароль"
                type="password"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Минимум 6 символов',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Нет аккаунта?{' '}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    Зарегистрироваться
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
