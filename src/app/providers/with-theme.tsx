import { ComponentType } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

export const withTheme = (Component: ComponentType) => {
  const WithTheme = () => {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component />
      </ThemeProvider>
    );
  };
  WithTheme.displayName = `withTheme(${Component.displayName || Component.name || 'Component'})`;
  return WithTheme;
};
