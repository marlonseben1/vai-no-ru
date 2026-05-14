import type { ReservaStatus } from '@repo/shared';

export type { ReservaStatus };

export type ReservaAcao = 'criada' | 'agendada' | 'cancelada' | 'reativada';

export interface Reserva {
  id: string;
  data_reserva: string;
  refeicao: string;
  status: ReservaStatus;
  created_at: string;
}

export interface ReservaHistoricoItem {
  id: string;
  reserva_id: string;
  acao: ReservaAcao;
  created_at: string;
}

export interface ReservasListResponse {
  data: Reserva[];
  total: number;
  page: number;
  pageSize: number;
}
