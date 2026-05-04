import type { CardapioDia as SharedCardapioDia } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';

export const fetchCardapio = async (
  dataInicio: string,
  dataFim: string,
): Promise<SharedCardapioDia[]> => {
  const { data } = await api.get<{
    success: boolean;
    data: SharedCardapioDia[];
  }>('/cardapio', {
    params: {
      universidade: 'upf',
      dataInicio,
      dataFim,
    },
  });
  return data.data;
};

export function useCardapio(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['cardapio', dataInicio, dataFim],
    queryFn: () => fetchCardapio(dataInicio, dataFim),
  });
}
