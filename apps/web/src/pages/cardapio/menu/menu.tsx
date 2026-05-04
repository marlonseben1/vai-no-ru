import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { CardapioDia as SharedCardapioDia } from '@repo/shared';
import { PiPlantFill } from 'react-icons/pi';
import { RiDrinks2Fill } from 'react-icons/ri';
import { iconesMapa, coresMapa } from '@/constants/constants.ts';
import { colorPalette } from '@/styles/colorPalette.ts';

export interface MenuProps {
  refeicao: SharedCardapioDia;
}

export function Menu({ refeicao }: MenuProps) {
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
        const iconColor = item.icone?.iconeId && coresMapa[item.icone.iconeId]
          ? coresMapa[item.icone.iconeId]
          : colorPalette.primary[800];
        
        return (
          <Box
            key={item.nome}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
          >
            {Icon && (
              <Box
                component="span"
                sx={{ display: 'flex', color: iconColor }}
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
