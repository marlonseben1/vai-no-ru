import { api } from '../api';
import type { DefaultListParams } from '../types';
import type {
  ReservaHistoricoItem,
  ReservasListResponse,
} from './reservas.types';

export const reservasApi = {
  async fetchReservas(
    params?: DefaultListParams,
  ): Promise<ReservasListResponse> {
    return api
      .get<ReservasListResponse>('/reservas', { params })
      .then((res) => res.data);
  },

  async cancelarReserva(id: string): Promise<void> {
    await api.delete(`/reservas/${id}`);
  },

  async reativarReserva(id: string): Promise<void> {
    await api.put(`/reservas/${id}`);
  },

  async fetchHistorico(id: string): Promise<ReservaHistoricoItem[]> {
    return api
      .get<ReservaHistoricoItem[]>(`/reservas/${id}/historico`)
      .then((res) => res.data);
  },
};
