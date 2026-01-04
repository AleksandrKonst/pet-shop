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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'User' | 'Manager';
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
    defaultValues: {
      role: 'User',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const result = await register(registerData).unwrap();
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
      console.error('Register error:', err);
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

    return 'Ошибка регистрации. Попробуйте снова.';
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Регистрация
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getErrorMessage()}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Имя пользователя"
                {...registerField('username', {
                  required: 'Имя пользователя обязательно',
                  minLength: {
                    value: 3,
                    message: 'Минимум 3 символа',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Максимум 50 символов',
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                {...registerField('email', {
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
                {...registerField('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Минимум 6 символов',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Максимум 100 символов',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                label="Подтвердите пароль"
                type="password"
                {...registerField('confirmPassword', {
                  required: 'Подтвердите пароль',
                  validate: value => value === getValues('password') || 'Пароли не совпадают',
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                margin="normal"
                autoComplete="new-password"
              />

              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel>Роль</InputLabel>
                <Select
                  label="Роль"
                  defaultValue="User"
                  {...registerField('role', {
                    required: 'Роль обязательна',
                  })}
                >
                  <MenuItem value="User">Пользователь</MenuItem>
                  <MenuItem value="Manager">Менеджер</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Уже есть аккаунт?{' '}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    Войти
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
