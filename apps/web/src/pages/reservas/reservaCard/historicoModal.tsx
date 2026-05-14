import { Box, CircularProgress, Typography } from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  MdOutlineCalendarToday,
  MdOutlineCancel,
  MdOutlineCheckCircle,
  MdOutlineReplay,
} from 'react-icons/md';
import { QUERY_KEYS } from '@/api/queryKeys';
import { reservasApi } from '@/api/reservas';
import type { ReservaAcao } from '@/api/reservas/reservas.types';
import { Dialog } from '@/components/dialog';
import { colorPalette } from '@/styles/colorPalette';

interface HistoricoModalProps {
  reservaId: string;
  open: boolean;
  onClose: () => void;
}

const ACAO_CONFIG: Record<
  ReservaAcao,
  { label: string; icon: React.ReactNode; dotColor: string }
> = {
  criada: {
    label: 'Criada',
    icon: <MdOutlineCalendarToday size={16} />,
    dotColor: colorPalette.neutral[400],
  },
  agendada: {
    label: 'Agendada com sucesso',
    icon: <MdOutlineCheckCircle size={16} />,
    dotColor: colorPalette.success.main,
  },
  cancelada: {
    label: 'Cancelada',
    icon: <MdOutlineCancel size={16} />,
    dotColor: colorPalette.error.main,
  },
  reativada: {
    label: 'Reativada',
    icon: <MdOutlineReplay size={16} />,
    dotColor: colorPalette.primary[500],
  },
};

export function HistoricoModal({ reservaId, open, onClose }: HistoricoModalProps) {
  const { data: historico, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.reservaHistorico, reservaId],
    queryFn: () => reservasApi.fetchHistorico(reservaId),
    enabled: open,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Dialog.Header closeIcon>Histórico da reserva</Dialog.Header>
      <Dialog.Content>
        {isLoading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        {historico && (
          <Timeline sx={{ p: 0, m: 0 }}>
            {historico.map((item, index) => {
              const config = ACAO_CONFIG[item.acao];
              const eUltimo = index === historico.length - 1;
              return (
                <TimelineItem key={item.id} sx={{ '&::before': { flex: 0, p: 0 }, alignItems: 'center' }}>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: config.dotColor, borderColor: config.dotColor }}>
                      {config.icon}
                    </TimelineDot>
                    {!eUltimo && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ px: 2, py: '12px' }}>
                    <Typography variant="bodySM">{config.label}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, mt: 0.25 }}>
                      <Typography variant="bodyXS" sx={{ color: colorPalette.neutral[400] }}>
                        {dayjs(item.created_at).format('DD/MM/YYYY')}
                      </Typography>
                      <Typography variant="bodyXS" sx={{ color: colorPalette.neutral[400] }}>
                        {dayjs(item.created_at).format('HH:mm')}
                      </Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </Dialog.Content>
    </Dialog>
  );
}
