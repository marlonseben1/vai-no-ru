import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import type { CardapioDia as SharedCardapioDia } from '@repo/shared';
import { PiPlantFill } from 'react-icons/pi';
import { RiDrinks2Fill } from 'react-icons/ri';
import { iconesMapa } from '@/constants/constants.ts';
import { colorPalette } from '@/styles/colorPalette.ts';
import {
  CustomTabs,
  type TabItem,
} from '../../components/customTabs/customTabs.tsx';
import { useCardapio } from './useCardapio';

dayjs.locale('pt-br');

function CardapioDiaComponent({ refeicao }: { refeicao: SharedCardapioDia }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 3 },
        border: `1px solid ${colorPalette.neutral[200]}`,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        color={colorPalette.neutral[900]}
        sx={{ mb: 1 }}
      >
        Menu do Dia
      </Typography>
      {refeicao.menuDoDia.map((item) => {
        const Icon = item.icone?.iconeId
          ? iconesMapa[item.icone.iconeId]
          : null;
        return (
          <Box
            key={item.nome}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
          >
            {Icon && (
              <Box
                component="span"
                sx={{ display: 'flex', color: colorPalette.primary[800] }}
              >
                <Icon size={20} />
              </Box>
            )}
            <Typography variant="body1">{item.nome}</Typography>
          </Box>
        );
      })}

      <Typography
        variant="subtitle2"
        color={colorPalette.neutral[900]}
        sx={{ mt: 1, mb: 1 }}
      >
        Saladas
      </Typography>
      {refeicao.saladas.map((item) => (
        <Box
          key={item}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
        >
          <Box
            component="span"
            sx={{ display: 'flex', color: colorPalette.success.main }}
          >
            <PiPlantFill size={20} />
          </Box>
          <Typography variant="body1">{item}</Typography>
        </Box>
      ))}

      {refeicao.suco && refeicao.suco.length > 0 && (
        <>
          <Typography
            variant="subtitle2"
            color={colorPalette.neutral[900]}
            sx={{ mt: 1, mb: 1 }}
          >
            Bebida
          </Typography>
          {refeicao.suco.map((item) => (
            <Box
              key={item.nome}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
            >
              <Box
                component="span"
                sx={{ display: 'flex', color: colorPalette.primary[500] }}
              >
                <RiDrinks2Fill size={20} />
              </Box>
              <Typography variant="body1">{item.nome}</Typography>
            </Box>
          ))}
        </>
      )}
    </Paper>
  );
}

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

  const tabs: TabItem[] = cardapio.map((dia) => ({
    nome: dayjs(dia.data).format('dddd'),
    children: <CardapioDiaComponent refeicao={dia} />,
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 2, color: colorPalette.neutral[900] }}
      >
        Cardápio da Semana ({periodoStr})
      </Typography>
      <CustomTabs tabs={tabs} />
    </Box>
  );
}
