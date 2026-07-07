import type { DataFiltroPreset, ReservaStatus } from '@repo/shared';

export type { DataFiltroPreset, ReservaStatus };

export type ReservaAcao = 'criada' | 'agendada' | 'cancelada' | 'reativada';

export interface ReservaFiltros {
  dataFiltro?: DataFiltroPreset;
  dataInicio?: string;
  dataFim?: string;
  refeicao?: string;
  situacao?: ReservaStatus;
}

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
