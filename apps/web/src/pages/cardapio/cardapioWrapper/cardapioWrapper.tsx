import { Box, Typography } from '@mui/material';
import type { CardapioDia } from '@repo/shared';
import dayjs from 'dayjs';
import { CustomTabs, type TabItem } from '@/components/customTabs/customTabs';
import { colorPalette } from '@/styles/colorPalette';
import { LegendaComponent } from '../legenda/legenda';
import { Menu } from '../menu/menu';

export interface CardapioWrapperProps {
  cardapio: CardapioDia[];
  dia: string;
}

export const CardapioWrapper = ({ cardapio, dia }: CardapioWrapperProps) => {
  const tabs: TabItem[] = cardapio.map((diaItem) => ({
    nome: dayjs(diaItem.data).format('dddd'),
    children: (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: 3,
          alignItems: 'stretch',
          overflowX: 'auto',
        }}
      >
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Menu refeicao={diaItem} />
        </Box>
        <Box sx={{ width: '350px', flexShrink: 0 }}>
          <LegendaComponent />
        </Box>
      </Box>
    ),
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 2, color: colorPalette.neutral[900] }}
      >
        Cardápio da Semana ({dia})
      </Typography>
      <CustomTabs tabs={tabs} />
    </Box>
  );
};
