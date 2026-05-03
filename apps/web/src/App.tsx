import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login } from './pages/login/login';
import { MainForm } from './pages/mainForm/mainForm';
import { ToastProvider } from './providers/toastProvider';
import { useAuthStore } from './store/auth/authStore';
import { theme } from './styles/theme';

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
    >
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
            {token ? <MainForm /> : <Login />}
          </Box>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
