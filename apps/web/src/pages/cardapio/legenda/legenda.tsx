import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { coresMapa, iconesMapa } from '@/constants/constants.ts';
import { colorPalette } from '@/styles/colorPalette.ts';

export function LegendaComponent() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        border: `1px solid ${colorPalette.neutral[200]}`,
        borderRadius: 2,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 2, color: colorPalette.neutral[900] }}
      >
        Legenda
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="span"
            sx={{ display: 'flex', color: coresMapa.vegetariano }}
          >
            {iconesMapa.vegetariano &&
              (() => {
                const Icon = iconesMapa.vegetariano;
                return <Icon size={20} />;
              })()}
          </Box>
          <Typography variant="body2" color={colorPalette.neutral[700]}>
            Vegetariano
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="span"
            sx={{ display: 'flex', color: coresMapa.carne }}
          >
            {iconesMapa.carne &&
              (() => {
                const Icon = iconesMapa.carne;
                return <Icon size={20} />;
              })()}
          </Box>
          <Typography variant="body2" color={colorPalette.neutral[700]}>
            Contém produto de origem animal / pode conter origem animal
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="span"
            sx={{ display: 'flex', color: coresMapa.suino }}
          >
            {iconesMapa.suino &&
              (() => {
                const Icon = iconesMapa.suino;
                return <Icon size={20} />;
              })()}
          </Box>
          <Typography variant="body2" color={colorPalette.neutral[700]}>
            Contém produto de origem suína / pode conter produto de origem suína
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="span"
            sx={{ display: 'flex', color: coresMapa.lactose }}
          >
            {iconesMapa.lactose &&
              (() => {
                const Icon = iconesMapa.lactose;
                return <Icon size={20} />;
              })()}
          </Box>
          <Typography variant="body2" color={colorPalette.neutral[700]}>
            Contém lactose
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="span"
            sx={{ display: 'flex', color: coresMapa.gluten }}
          >
            {iconesMapa.gluten &&
              (() => {
                const Icon = iconesMapa.gluten;
                return <Icon size={20} />;
              })()}
          </Box>
          <Typography variant="body2" color={colorPalette.neutral[700]}>
            Contém glúten
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="span" sx={{ display: 'flex', color: coresMapa.ovo }}>
            {iconesMapa.ovo &&
              (() => {
                const Icon = iconesMapa.ovo;
                return <Icon size={20} />;
              })()}
          </Box>
          <Typography variant="body2" color={colorPalette.neutral[700]}>
            Contém ovos
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
