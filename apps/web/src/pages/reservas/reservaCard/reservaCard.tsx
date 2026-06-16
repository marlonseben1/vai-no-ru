import {
  Box,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { RESERVA_STATUS, type ReservaStatus } from '@repo/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  MdOutlineCancel,
  MdOutlineHistory,
  MdOutlineReplay,
} from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import 'dayjs/locale/pt-br';
import { QUERY_KEYS } from '@/api/queryKeys';
import { reservasApi } from '@/api/reservas';
import type { Reserva } from '@/api/reservas/reservas.types';
import { useToast } from '@/hooks/useToast';
import { colorPalette } from '@/styles/colorPalette';
import { HistoricoModal } from './historicoModal';

dayjs.locale('pt-br');

interface ReservaCardProps {
  reserva: Reserva;
}

const STATUS_CONFIG: Record<
  ReservaStatus,
  {
    label: string;
    color: 'primary' | 'success' | 'error' | 'warning' | 'default';
  }
> = {
  [RESERVA_STATUS.PENDENTE]: { label: 'Pendente', color: 'primary' },
  [RESERVA_STATUS.AGENDADA]: { label: 'Agendada', color: 'success' },
  [RESERVA_STATUS.NAO_AGENDADA]: { label: 'Não agendada', color: 'error' },
  [RESERVA_STATUS.INATIVA]: { label: 'Inativa', color: 'default' },
  [RESERVA_STATUS.CANCELADA]: { label: 'Cancelada', color: 'warning' },
};

export function ReservaCard({ reserva }: ReservaCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: cancelar, isPending: isCancelPending } = useMutation({
    mutationFn: () => reservasApi.cancelarReserva(reserva.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.reservas] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.reservaHistorico, reserva.id] });
      showToast('Reserva cancelada com sucesso.', 'success');
      setAnchorEl(null);
    },
    onError: () => {
      showToast('Erro ao cancelar a reserva.', 'error');
      setAnchorEl(null);
    },
  });

  const { mutate: reativar, isPending: isReactivatePending } = useMutation({
    mutationFn: () => reservasApi.reativarReserva(reserva.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.reservas] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.reservaHistorico, reserva.id] });
      showToast('Reserva reativada com sucesso.', 'success');
      setAnchorEl(null);
    },
    onError: () => {
      showToast('Erro ao reativar a reserva.', 'error');
      setAnchorEl(null);
    },
  });

  const deveExibirCancelar =
    reserva.status === RESERVA_STATUS.PENDENTE ||
    reserva.status === RESERVA_STATUS.NAO_AGENDADA;
  const deveExibirReativar = reserva.status === RESERVA_STATUS.CANCELADA;
  const statusConfig = STATUS_CONFIG[reserva.status];
  const formattedDate = dayjs(reserva.data_reserva).format('DD/MM/YYYY');
  const weekday = dayjs(reserva.data_reserva).format('dddd');
  const isPending = isCancelPending || isReactivatePending;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="bodyMD"
          fontWeight={600}
          sx={{ textTransform: 'capitalize' }}
        >
          {weekday}, {formattedDate}
        </Typography>
        <Typography variant="bodySM" sx={{ color: colorPalette.neutral[600] }}>
          {reserva.refeicao}
        </Typography>
      </Box>

      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}
      >
        <Chip
          label={statusConfig.label}
          color={statusConfig.color}
          size="small"
          variant="outlined"
          sx={{ minWidth: 120 }}
        />
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <RxHamburgerMenu />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: { elevation: 3, sx: { borderRadius: 1, minWidth: 160 } },
        }}
      >
        {deveExibirCancelar && (
          <MenuItem onClick={() => cancelar()} disabled={isPending}>
            <ListItemIcon>
              <MdOutlineCancel size={18} />
            </ListItemIcon>
            <Typography variant="bodySM">Cancelar</Typography>
          </MenuItem>
        )}
        {deveExibirReativar && (
          <MenuItem onClick={() => reativar()} disabled={isPending}>
            <ListItemIcon>
              <MdOutlineReplay size={18} />
            </ListItemIcon>
            <Typography variant="bodySM">Reativar</Typography>
          </MenuItem>
        )}
        {!deveExibirCancelar && !deveExibirReativar && (
          <MenuItem disabled>
            <Typography
              variant="bodySM"
              sx={{ color: colorPalette.neutral[400] }}
            >
              Sem ações disponíveis
            </Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setHistoricoAberto(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <MdOutlineHistory size={18} />
          </ListItemIcon>
          <Typography variant="bodySM">Histórico</Typography>
        </MenuItem>
      </Menu>

      <HistoricoModal
        reservaId={reserva.id}
        open={historicoAberto}
        onClose={() => setHistoricoAberto(false)}
      />
    </Paper>
  );
}
