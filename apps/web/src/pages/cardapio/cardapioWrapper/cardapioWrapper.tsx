import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const renderContent = (diaItem: CardapioDia) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'stretch',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Menu refeicao={diaItem} />
      </Box>
      <Box sx={{ width: { xs: '100%', md: '350px' }, flexShrink: 0 }}>
        <LegendaComponent />
      </Box>
    </Box>
  );

  const tabs: TabItem[] = cardapio.map((diaItem) => ({
    nome: dayjs(diaItem.data).format('dddd'),
    children: renderContent(diaItem),
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 2, color: colorPalette.neutral[900] }}
      >
        Cardápio da Semana{' '}
        <Box component="span" sx={{ display: { xs: 'block', md: 'inline' } }}>
          ({dia})
        </Box>
      </Typography>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cardapio.map((diaItem) => (
            <Accordion
              key={diaItem.data}
              elevation={0}
              sx={{
                border: `1px solid ${colorPalette.neutral[200]}`,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  variant="subtitle1"
                  fontWeight="500"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {dayjs(diaItem.data).format('dddd')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Menu refeicao={diaItem} />
              </AccordionDetails>
            </Accordion>
          ))}
          <Box sx={{ mt: 1 }}>
            <LegendaComponent />
          </Box>
        </Box>
      ) : (
        <CustomTabs tabs={tabs} />
      )}
    </Box>
  );
};
