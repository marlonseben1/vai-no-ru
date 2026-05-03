import { Box, Typography } from '@mui/material';
import { type CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { colorPalette } from '@/styles/colorPalette';
import { api } from '../../api';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/auth/authStore';

export const Login = () => {
  const { showToast } = useToast();
  const login = useAuthStore((state) => state.login);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { data } = await api.post('/auth/google', {
        token: credentialResponse.credential,
      });

      if (!data || data.error || !data.token) {
        throw new Error(
          data?.error || 'Usuário não cadastrado ou erro na autenticação.',
        );
      }

      login(data.token, data.user);
      showToast('Login realizado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Usuário não cadastrado ou erro na autenticação.', 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: { xs: '0%', md: '50%' },
          bgcolor: colorPalette.primary[800],
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 4, md: 8 },
          bgcolor: '#fafafa',
          position: 'relative',
        }}
      >
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 6 }}>
          <Typography
            sx={{
              fontSize: 13,
              letterSpacing: 3,
              color: colorPalette.primary[800],
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            RU · Agendamento
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 400,
            color: '#111',
            lineHeight: 1.3,
            mb: 1,
            textAlign: 'center',
          }}
        >
          Seja bem-vindo!
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: '#888',

            mb: 5,
            lineHeight: 1.7,
            textAlign: 'center',
          }}
        >
          Entre com sua conta institucional Google
          <br />
          para acessar o painel de agendamentos.
        </Typography>

        <Box
          sx={{
            width: '60%',
            height: 2,
            bgcolor: colorPalette.primary[800],
            borderRadius: 1,
            mb: 5,
          }}
        />

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => showToast('Falha ao conectar com o Google', 'error')}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
        />

        <Typography
          sx={{
            position: 'absolute',
            bottom: 24,
            fontSize: 12,
            color: '#aaa',
          }}
        >
          © {new Date().getFullYear()} Marlon Seben. Todos os direitos
          reservados.
        </Typography>
      </Box>
    </Box>
  );
};
