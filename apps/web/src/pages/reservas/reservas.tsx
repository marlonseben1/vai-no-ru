import {
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { colorPalette } from '@/styles/colorPalette';
import { ReservaCard } from './reservaCard/reservaCard';
import { PAGE_SIZE, useReservas } from './useReservas';

export const Reservas = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useReservas(page);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <Paper
      elevation={3}
      sx={{ borderRadius: 2, maxWidth: 800, mx: 'auto', p: 4, mt: 2 }}
    >
      <Box mb={3}>
        <Typography
          variant="titleSM"
          component="h1"
          sx={{ color: colorPalette.primary[500] }}
        >
          Minhas Reservas
        </Typography>
        <Typography variant="bodySM" sx={{ color: colorPalette.neutral[600] }}>
          Acompanhe o status e histórico dos seus agendamentos no RU
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography
          variant="bodyMD"
          sx={{ color: colorPalette.error.main }}
          textAlign="center"
          py={6}
        >
          Erro ao carregar as reservas. Tente novamente.
        </Typography>
      )}

      {data && data.data.length === 0 && (
        <Typography
          variant="bodyMD"
          sx={{ color: colorPalette.neutral[600] }}
          textAlign="center"
          py={6}
        >
          Você ainda não possui reservas agendadas.
        </Typography>
      )}

      {data && data.data.length > 0 && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {data.data.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} />
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};
