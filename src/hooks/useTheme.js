import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { getUserSettings } from '../services/storage';

const useTheme = () => {
  const settings = getUserSettings();
  const darkMode = settings?.darkMode ?? false;
  const fontSize = settings?.fontSize ?? 16;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#2196f3',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: fontSize,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease',
              },
            },
          },
        },
      }),
    [darkMode, fontSize]
  );

  return theme;
};

export default useTheme; 