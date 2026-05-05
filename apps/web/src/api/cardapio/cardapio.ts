import { api } from '../api';
import type {
  CardapioResponse,
  FetchCardapioParams,
  CardapioDia,
} from './cardapio.types';

export const cardapioApi = {
  async fetchCardapio({
    dataInicio,
    dataFim,
  }: FetchCardapioParams): Promise<CardapioDia[]> {
    return api
      .get<CardapioResponse>('/cardapio', {
        params: {
          universidade: 'upf',
          dataInicio,
          dataFim,
        },
      })
      .then((res) => res.data.data);
  },
};
