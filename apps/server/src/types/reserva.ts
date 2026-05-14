import type { ReservaStatus } from '@repo/shared';

export type { ReservaStatus };

export type ReservaAcao = 'criada' | 'agendada' | 'cancelada' | 'reativada';

export interface ReservaHistoricoItem {
  id: string;
  reserva_id: string;
  acao: ReservaAcao;
  created_at: string;
}

export interface ReservaItem {
  id: string;
  data_reserva: string;
  refeicao: string;
  status: ReservaStatus;
  created_at: string;
}

export interface ReservaListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedReservas {
  data: ReservaItem[];
  total: number;
  page: number;
  pageSize: number;
}
