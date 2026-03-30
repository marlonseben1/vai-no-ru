import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { RUForm } from './components/RUForm/RUForm';
import { theme } from './styles/theme';
import { ToastProvider } from './providers/ToastProvider';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ bgcolor: 'background.default' }}
        >
          <RUForm />
        </Box>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
