import { CssBaseline, ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './providers/toastProvider';
import { AppRoutes } from './routes/routes';
import { theme } from './styles/theme';

const queryClient = new QueryClient();

function App() {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <CssBaseline />
            <AppRoutes />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
