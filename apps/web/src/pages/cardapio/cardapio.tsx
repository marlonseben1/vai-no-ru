import { Box, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { colorPalette } from '@/styles/colorPalette';
import { CardapioWrapper } from './cardapioWrapper/cardapioWrapper';
import { useCardapio } from './useCardapio';

dayjs.locale('pt-br');

export default function Cardapio() {
  const hoje = dayjs();
  const inicioDaSemana = hoje.startOf('week').add(1, 'day'); // Segunda-feira
  const fimDaSemana = hoje.endOf('week').subtract(1, 'day'); // Sexta-feira
  const periodoStr = `${inicioDaSemana.format('DD/MM/YYYY')} - ${fimDaSemana.format('DD/MM/YYYY')}`;

  const {
    data: cardapio,
    isLoading,
    isError,
  } = useCardapio(
    inicioDaSemana.format('YYYY-MM-DD'),
    fimDaSemana.format('YYYY-MM-DD'),
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !cardapio) {
    return (
      <Typography variant="body1" color="error" align="center" sx={{ p: 4 }}>
        Erro ao carregar o cardápio.
      </Typography>
    );
  }

  if (cardapio.length === 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Cardápio da Semana ({periodoStr})
        </Typography>
        <Typography
          variant="body1"
          color={colorPalette.neutral[600]}
          align="center"
          sx={{ p: 4 }}
        >
          Nenhum cardápio disponível no momento.
        </Typography>
      </Box>
    );
  }

  return <CardapioWrapper cardapio={cardapio} dia={periodoStr} />;
}
