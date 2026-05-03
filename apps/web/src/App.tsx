import { CssBaseline, ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from './providers/toastProvider';
import { AppRoutes } from './routes/routes';
import { theme } from './styles/theme';

function App() {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
    >
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <CssBaseline />
          <AppRoutes />
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
