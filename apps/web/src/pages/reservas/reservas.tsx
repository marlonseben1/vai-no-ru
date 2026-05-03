import { Box, Divider, Paper, Typography } from '@mui/material';

export const Reservas = () => {
  return (
    <Paper
      elevation={3}
      sx={{ borderRadius: 2, maxWidth: 800, mx: 'auto', p: 4, mt: 2 }}
    >
      <Box mb={3}>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          color="primary"
        >
          Minhas Reservas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acompanhe o status e histórico dos seus agendamentos no RU.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">
          (Em breve: Lista de reservas)
        </Typography>
      </Box>
    </Paper>
  );
};
