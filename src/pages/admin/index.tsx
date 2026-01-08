import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/shared/lib/store/hooks';
import { logout } from '@/features/auth';
import { CategoriesManagement, ProductsManagement, AllOrdersView } from '@/features/admin';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    // Проверка роли
    if (user?.role !== 'Manager') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            ← Главная
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            👨‍💼 Панель администратора
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="inherit">
              {user?.username} (Менеджер)
            </Typography>
            <Button color="inherit" onClick={() => dispatch(logout())}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Paper elevation={2}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="📦 Категории" />
            <Tab label="🛍️ Товары" />
            <Tab label="📋 Все заказы" />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <CategoriesManagement />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <ProductsManagement />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <AllOrdersView />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};
