import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Stack } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d96206',
    },
    secondary: {
      main: '#000000',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Интернет-магазин зоотоваров
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Тут будет какой то текст
          </Typography>

          <Stack spacing={3} sx={{ mt: 2 }} direction={{ xs: 'column', md: 'row' }}>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Что то там для собак
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Текст
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Тык
                  </Button>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Что то там для котов
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Текст
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Тык
                  </Button>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Что то там для птиц
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Текст
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Тык
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
