import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Badge,
  Box,
  Button,
  TextField,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import type { ReservaFiltros } from '@/api/reservas/reservas.types';
import { Dialog } from '@/components/dialog';
import {
  SelectFieldInput,
  type SelectOption,
} from '@/components/selectFieldInput/selectFieldInput';
import { colorPalette } from '@/styles/colorPalette';
import { RESERVA_STATUS, refeicaoEnum } from '@repo/shared';
import { useFiltrosConteudo, useFiltrosReservas } from './useFiltrosReservas';

interface FiltrosReservasProps {
  filtros: ReservaFiltros;
  onChange: (filtros: ReservaFiltros) => void;
}

const periodoOpcoes: SelectOption[] = [
  { value: '', label: 'Todos' },
  { value: 'essa_semana', label: 'Esta Semana' },
  { value: 'semana_passada', label: 'Semana Passada' },
  { value: 'personalizado', label: 'Personalizado' },
];

const refeicaoOpcoes: SelectOption[] = [
  { value: '', label: 'Todas' },
  ...refeicaoEnum.options.map((refeicao) => ({
    value: refeicao,
    label: refeicao,
  })),
];

const situacaoOpcoes: SelectOption[] = [
  { value: '', label: 'Todas' },
  { value: RESERVA_STATUS.PENDENTE, label: 'Pendente' },
  { value: RESERVA_STATUS.AGENDADA, label: 'Agendada' },
  { value: RESERVA_STATUS.NAO_AGENDADA, label: 'Não Agendada' },
  { value: RESERVA_STATUS.INATIVA, label: 'Inativa' },
  { value: RESERVA_STATUS.CANCELADA, label: 'Cancelada' },
];

interface FiltrosConteudoProps {
  filtros: ReservaFiltros;
  onChange: (filtros: ReservaFiltros) => void;
  stacked?: boolean;
}

function FiltrosConteudo({ filtros, onChange, stacked }: FiltrosConteudoProps) {
  const {
    handleDataFiltro,
    handleRefeicao,
    handleSituacao,
    handleDataInicio,
    handleDataFim,
  } = useFiltrosConteudo(filtros, onChange);

  const rowSx = stacked
    ? { display: 'flex', flexDirection: 'column' as const, gap: 2 }
    : { display: 'flex', gap: 1.5, flexWrap: 'wrap' as const };

  const wrapperSx = stacked ? {} : { flex: 1, minWidth: 140, maxWidth: 220 };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={rowSx}>
        <Box sx={wrapperSx}>
          <SelectFieldInput
            label="Período"
            options={periodoOpcoes}
            value={filtros.dataFiltro ?? ''}
            onChange={handleDataFiltro}
          />
        </Box>

        <Box sx={wrapperSx}>
          <SelectFieldInput
            label="Refeição"
            options={refeicaoOpcoes}
            value={filtros.refeicao ?? ''}
            onChange={handleRefeicao}
          />
        </Box>

        <Box sx={wrapperSx}>
          <SelectFieldInput
            label="Situação"
            options={situacaoOpcoes}
            value={filtros.situacao !== undefined ? filtros.situacao : ''}
            onChange={handleSituacao}
          />
        </Box>
      </Box>

      {filtros.dataFiltro === 'personalizado' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={
              stacked
                ? { display: 'flex', flexDirection: 'column', gap: 2 }
                : { display: 'flex', gap: 1.5, flexWrap: 'wrap' }
            }
          >
            <DatePicker
              label="Data início"
              value={filtros.dataInicio ? dayjs(filtros.dataInicio) : null}
              onChange={handleDataInicio}
              maxDate={filtros.dataFim ? dayjs(filtros.dataFim) : undefined}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: stacked ? { width: '100%' } : { maxWidth: 180 },
                },
              }}
            />
            <DatePicker
              label="Data fim"
              value={filtros.dataFim ? dayjs(filtros.dataFim) : null}
              onChange={handleDataFim}
              minDate={filtros.dataInicio ? dayjs(filtros.dataInicio) : undefined}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: stacked ? { width: '100%' } : { maxWidth: 180 },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
}

export function FiltrosReservas({ filtros, onChange }: FiltrosReservasProps) {
  const isMobile = useMediaQuery('(max-width: 599px)');
  const {
    dialogAberto,
    pendentes,
    setPendentes,
    filtrosAtivos,
    abrirDialog,
    fecharDialog,
    aplicar,
    limparPendentes,
    limparAplicados,
  } = useFiltrosReservas(filtros, onChange);

  if (!isMobile) {
    return (
      <Box mb={2}>
        <FiltrosConteudo filtros={filtros} onChange={onChange} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Badge badgeContent={filtrosAtivos} color="primary">
          <Button
            startIcon={<TuneIcon />}
            onClick={abrirDialog}
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: colorPalette.neutral[300],
              color: colorPalette.neutral[700],
              fontWeight: 500,
              '&:hover': { borderColor: colorPalette.primary[400] },
            }}
          >
            Filtros
          </Button>
        </Badge>

        {filtrosAtivos > 0 && (
          <Button
            startIcon={<FilterListOffIcon />}
            onClick={limparAplicados}
            size="small"
            sx={{
              textTransform: 'none',
              color: colorPalette.neutral[500],
              fontSize: '0.75rem',
            }}
          >
            Limpar
          </Button>
        )}
      </Box>

      <Dialog
        open={dialogAberto}
        onClose={fecharDialog}
        fullWidth
        maxWidth="sm"
        fullScreen
      >
        <Dialog.Header closeIcon>Filtros</Dialog.Header>

        <Dialog.Content sx={{ px: 3, pb: 1 }}>
          <Box sx={{ mt: 2 }}>
            <FiltrosConteudo filtros={pendentes} onChange={setPendentes} stacked />
          </Box>
        </Dialog.Content>

        <Dialog.Footer sx={{ px: 3, pb: 3, pt: 1, gap: 1, flexDirection: 'column' }}>
          <Button
            startIcon={<FilterListOffIcon />}
            onClick={limparPendentes}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: colorPalette.neutral[300],
              color: colorPalette.neutral[600],
            }}
          >
            Limpar filtros
          </Button>
          <Button
            onClick={aplicar}
            variant="contained"
            fullWidth
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
          >
            Aplicar
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
