import type { DataFiltroPreset, ReservaStatus } from '@repo/shared';

export type { DataFiltroPreset, ReservaStatus };

export type ReservaAcao =
  | 'criada'
  | 'agendada'
  | 'nao_agendada'
  | 'cancelada'
  | 'reativada';

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
  dataFiltro?: DataFiltroPreset;
  dataInicio?: string;
  dataFim?: string;
  refeicao?: string;
  situacao?: number;
}

export interface PaginatedReservas {
  data: ReservaItem[];
  total: number;
  page: number;
  pageSize: number;
}
